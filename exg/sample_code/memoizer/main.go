package main

import (
	"errors"
	"fmt"
	"reflect"
	"time"
)

type outExp struct {
	out    []reflect.Value
	expiry time.Time
}

// buildInStruct creates a dynamic struct whose fields match the input parameters for the
// memoized function.
func buildInStruct(ft reflect.Type) (reflect.Type, error) {
	if ft.NumIn() == 0 {
		return nil, errors.New("must have at least one param")
	}
	// to create a dynamic struct, we create a slice of reflect.StructField
	sf := make([]reflect.StructField, 0, ft.NumIn())
	for i := 0; i < ft.NumIn(); i++ {
		ct := ft.In(i)
		// since this struct will be used as the key in a map, the struct must be comparable.
		// for a struct to be comparable, all of its fields must also be comparable.
		if !ct.Comparable() {
			return nil, fmt.Errorf("parameter %d of type %s and kind %v is not comparable", i+1, ct.Name(), ct.Kind())
		}
		// we add a struct field to sf for the input parameter,
		// making up a name and using the type from the input parameter
		sf = append(sf, reflect.StructField{
			Name: fmt.Sprintf("F%d", i),
			Type: ct,
		})
	}
	// this creates our dynamic struct type from our struct fields
	s := reflect.StructOf(sf)
	return s, nil
}

// Memoizer takes in a function and returns a wrapper function that caches the results of
// running the function for the specified duration.
//
// There are limitations on the functions that can be passed in to Memoizer.
//  1. The function should be long-running. Otherwise, there's no point in caching its results.
//  2. The function shouldn't have side effects. If it does, the side effects will only run when the
//     results for the provided parameters are not cached.
//  3. The input paramaters for the function must be comparable.
func Memoizer[T any](f T, expiration time.Duration) (T, error) {
	ft := reflect.TypeOf(f)
	if ft.Kind() != reflect.Func {
		var zero T
		return zero, errors.New("only for functions")
	}

	// we use a dynamic struct type to represent the input parameters for the function
	inType, err := buildInStruct(ft)
	if err != nil {
		var zero T
		return zero, err
	}

	if ft.NumOut() == 0 {
		var zero T
		return zero, errors.New("must have at least one returned value")
	}

	m := map[interface{}]outExp{}
	fv := reflect.ValueOf(f)

	// we use the reflect.MakeFunc function to create a function with the same
	// input and output parameters as the provided function
	memo := reflect.MakeFunc(ft, func(args []reflect.Value) []reflect.Value {
		// create a key for our map
		iv := reflect.New(inType).Elem()
		for k, v := range args {
			iv.Field(k).Set(v)
		}
		ivv := iv.Interface()

		// check to see if the key is in the map and hasn't expired
		ov, ok := m[ivv]
		now := time.Now()
		if !ok || ov.expiry.Before(now) {
			// if the key isn't in the map, or the result has expired,
			// run the function and cache the results in the map
			ov.out = fv.Call(args)
			ov.expiry = now.Add(expiration)
			m[ivv] = ov
		}
		// return the value in the cache
		return ov.out
	})
	// return the memoized function
	return memo.Interface().(T), nil
}

func AddSlowly(a, b int) int {
	time.Sleep(100 * time.Millisecond)
	return a + b
}

func main() {
	addSlowly, err := Memoizer(AddSlowly, 2*time.Second)
	if err != nil {
		panic(err)
	}
	for i := 0; i < 5; i++ {
		start := time.Now()
		result := addSlowly(1, 2)
		end := time.Now()
		fmt.Println("got result", result, "in", end.Sub(start))
	}
	time.Sleep(3 * time.Second)
	start := time.Now()
	result := addSlowly(1, 2)
	end := time.Now()
	fmt.Println("got result", result, "in", end.Sub(start))
}
