package main

import (
	"fmt"
	"reflect"
	"runtime"
	"time"
)

func MakeTimedFunction(f interface{}) interface{} {
	rf := reflect.TypeOf(f)
	if rf.Kind() != reflect.Func {
		panic("expects a function")
	}
	vf := reflect.ValueOf(f)
	wrapperF := reflect.MakeFunc(rf, func(in []reflect.Value) []reflect.Value {
		start := time.Now()
		out := vf.Call(in)
		end := time.Now()
		fmt.Printf("calling %s took %v\n", runtime.FuncForPC(vf.Pointer()).Name(), end.Sub(start))
		return out
	})
	return wrapperF.Interface()
}

func timeMe() {
	time.Sleep(1 * time.Second)
}

func timeMeToo(a int) int {
	time.Sleep(time.Duration(a) * time.Second)
	result := a * 2
	return result
}

func main() {
	timed := MakeTimedFunction(timeMe).(func())
	timed()
	timedToo := MakeTimedFunction(timeMeToo).(func(int) int)
	fmt.Println(timedToo(2))
}
