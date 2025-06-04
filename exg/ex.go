package main

import (
	"encoding/csv"
	"errors"
	"fmt"
	"reflect"
	"strconv"
	"strings"
)

// Marshal maps all of structs in a slice of structs to a slice of slice of strings.
// The first row written is the header with the column names.
func Marshal(v interface{}) ([][]string, error) {
	sliceVal := reflect.ValueOf(v)
	if sliceVal.Kind() != reflect.Slice {
		return nil, errors.New("must be a slice of structs")
	}
	structType := sliceVal.Type().Elem()
	if structType.Kind() != reflect.Struct {
		return nil, errors.New("must be a slice of structs")
	}
	var out [][]string
	header := marshalHeader(structType)
	out = append(out, header)
	for i := 0; i < sliceVal.Len(); i++ {
		row, err := marshalOne(sliceVal.Index(i))
		if err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, nil
}

func marshalHeader(vt reflect.Type) []string {
	var row []string
	for i := 0; i < vt.NumField(); i++ {
		field := vt.Field(i)
		if curTag, ok := field.Tag.Lookup("csv"); ok {
			row = append(row, curTag)
		}
	}
	return row
}

func marshalOne(vv reflect.Value) ([]string, error) {
	var row []string
	vt := vv.Type()
	for i := 0; i < vv.NumField(); i++ {
		fieldVal := vv.Field(i)
		if _, ok := vt.Field(i).Tag.Lookup("csv"); !ok {
			continue
		}
		switch fieldVal.Kind() {
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			row = append(row, strconv.FormatInt(fieldVal.Int(), 10))
		case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
			row = append(row, strconv.FormatUint(fieldVal.Uint(), 10))
		case reflect.String:
			row = append(row, fieldVal.String())
		case reflect.Bool:
			row = append(row, strconv.FormatBool(fieldVal.Bool()))
		default:
			return nil, fmt.Errorf("unsupported type: %s", fieldVal.Kind())
		}
	}
	return row, nil
}

// Unmarshal maps all of the rows of data in slice of slice of strings into a slice of structs.
// The first row is assumed to be the header with the column names.
func Unmarshal(data [][]string, v interface{}) error {
	sliceValPtr := reflect.ValueOf(v)
	if sliceValPtr.Kind() != reflect.Ptr {
		return errors.New("must be a pointer to a slice of structs")
	}
	sliceVal := sliceValPtr.Elem()
	if sliceVal.Kind() != reflect.Slice {
		return errors.New("must be a slice of structs")
	}
	structType := sliceVal.Type().Elem()
	if structType.Kind() != reflect.Struct {
		return errors.New("must be a pointer to a slice of structs")
	}

	// assume the first row is a header
	header := data[0]
	namePos := make(map[string]int, len(header))
	for i, name := range header {
		namePos[name] = i
	}

	for _, row := range data[1:] {
		newVal := reflect.New(structType).Elem()
		err := unmarshalOne(row, namePos, newVal)
		if err != nil {
			return err
		}
		sliceVal.Set(reflect.Append(sliceVal, newVal))
	}
	return nil
}

func unmarshalOne(row []string, namePos map[string]int, vv reflect.Value) error {
	vt := vv.Type()
	for i := 0; i < vv.NumField(); i++ {
		typeField := vt.Field(i)
		pos, ok := namePos[typeField.Tag.Get("csv")]
		if !ok {
			continue
		}
		val := row[pos]
		field := vv.Field(i)
		switch field.Kind() {
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			i, err := strconv.ParseInt(val, 10, 64)
			if err != nil {
				return err
			}
			field.SetInt(i)
		case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
			i, err := strconv.ParseUint(val, 10, 64)
			if err != nil {
				return err
			}
			field.SetUint(i)
		case reflect.String:
			field.SetString(val)
		case reflect.Bool:
			b, err := strconv.ParseBool(val)
			if err != nil {
				return err
			}
			field.SetBool(b)
		default:
			return fmt.Errorf("cannot handle field of kind %v", field.Kind())
		}
	}
	return nil
}

type MyData struct {
	Name   string `csv:"name"`
	HasPet bool   `csv:"has_pet"`
	Age    int    `csv:"age"`
}

func main() {
	data := `name,age,has_pet
Jon,"100",true
"Fred ""The Hammper"" Smith",42,false
Martha,37,"true"`

	r := csv.NewReader(strings.NewReader(data))
	allData, err := r.ReadAll()
	if err != nil {
		panic(err)
	}
	var entries []MyData
	Unmarshal(allData, &entries)
	fmt.Println(entries)

	//now to turn entries into output
	out, err := Marshal(entries)
	if err != nil {
		panic(err)
	}
	sb := &strings.Builder{}
	w := csv.NewWriter(sb)
	w.WriteAll(out)
	fmt.Println(sb)

}
