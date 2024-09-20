package other_package

import (
	"fmt"
	"github.com/learning-go-book-2e/ch16/sample_code/unexported_field_access/one_package"
	"reflect"
	"unsafe"
)

func SetBUnsafe(huf *one_package.HasUnexportedField) {
	fmt.Println(unsafe.Sizeof(*huf))
	fmt.Println(unsafe.Offsetof(huf.A))
	// this line will fail to compile because you can't access unexported field b here
	//offset := unsafe.Offsetof(huf.b)
	fmt.Println(unsafe.Offsetof(huf.C))

	// use reflection to get the offset of the unexported field
	sf, _ := reflect.TypeOf(huf).Elem().FieldByName("b")
	offset := sf.Offset
	fmt.Println("b offset", offset)

	// use unsafe to access the data at that position
	start := unsafe.Pointer(huf)
	pos := unsafe.Add(start, offset)
	b := (*bool)(pos)
	*b = true
}
