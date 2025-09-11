package main

import (
	"fmt"
	"reflect"
)

func main() {
	type Foo struct {
		A int    `myTag:"value"`
		B string `myTag:"value2"`
	}

	var f Foo
	ft := reflect.TypeOf(f)
	for i := 0; i < ft.NumField(); i++ {
		curField := ft.Field(i)
		fmt.Println(curField.Name, curField.Type.Name(),
			curField.Tag.Get("myTag"))
	}
}
