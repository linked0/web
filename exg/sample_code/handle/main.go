package main

/*
 	#include <stdint.h>

	extern void in_c(uintptr_t handle);
*/
import "C"

import (
	"fmt"
	"runtime/cgo"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	p := Person{
		Name: "Jon",
		Age:  21,
	}
	C.in_c(C.uintptr_t(cgo.NewHandle(p)))
}

//export processor
func processor(handle C.uintptr_t) {
	h := cgo.Handle(handle)
	p := h.Value().(Person)
	fmt.Println(p.Name, p.Age)
	h.Delete()
}
