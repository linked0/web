package main

/*
   extern int mini_calc(char *op, int a, int b);
*/
import "C"
import (
	"fmt"
	"log"
	"os"
	"strconv"
)

func main() {
	if len(os.Args) < 4 {
		log.Fatal("Need at least 3 args: int op int")
	}
	arg1, err := strconv.Atoi(os.Args[1])
	if err != nil {
		log.Fatal("invalid number:", os.Args[1])
	}
	arg2, err := strconv.Atoi(os.Args[3])
	if err != nil {
		log.Fatal("invalid number:", os.Args[3])
	}
	op := os.Args[2]
	result := C.mini_calc(C.CString(op), C.int(arg1), C.int(arg2))
	fmt.Println(result)
}
