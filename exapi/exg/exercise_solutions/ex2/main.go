package main

import (
	"fmt"
	"unsafe"
)

// OrderInfo has a total size of 56 bytes:
type OrderInfo struct {
	OrderCode   rune     // 4 bytes, plus 4 for padding
	Amount      int      // 8 bytes, no padding
	OrderNumber uint16   // 2 bytes, plus 6 for padding
	Items       []string // 24 bytes, no padding
	IsReady     bool     // 1 byte, plus 7 for padding
}

func main() {
	// Print the size of the OrderInfo struct
	info := OrderInfo{}
	fmt.Println("Size of OrderInfo:", unsafe.Sizeof(info))

	// Print the offsets of each field in the OrderInfo struct
	fmt.Println("Offset of OrderCode:", unsafe.Offsetof(info.OrderCode))
	fmt.Println("Offset of Amount:", unsafe.Offsetof(info.Amount))
	fmt.Println("Offset of OrderNumber:", unsafe.Offsetof(info.OrderNumber))
	fmt.Println("Offset of Items:", unsafe.Offsetof(info.Items))
	fmt.Println("Offset of IsReady:", unsafe.Offsetof(info.IsReady))
}

// SmallOrderInfo has a total size of 40 bytes:
type SmallOrderInfo struct {
	IsReady     bool     // 1 byte, plus 1 byte of padding
	OrderNumber uint16   // 2 bytes, no padding
	OrderCode   rune     // 4 bytes, no padding
	Amount      int      // 8 bytes, no padding
	Items       []string // 24 bytes, no padding
}
