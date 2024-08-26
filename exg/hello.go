package main

import "fmt"

func main() {
	var x, y = 10, "hello"
	fmt.Println("Hello, world!")
	fmt.Println(x, y)

	z := 20
	fmt.Println(z)

	const xx = 10
	var yy int = xx
	var zz float64 = xx
	var d byte = xx

	fmt.Println(yy, zz, d)

	var x3 = [12]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	fmt.Println(x3)

	var x4 []int
	x4 = append(x4, 1)
	fmt.Println(x4)

	x5 := make([]int, 5)
	x5 = append(x5, 10)
	fmt.Println(x5)

	// Define a string that includes Unicode characters
	str := "Hello, 世界"

	// Iterate through the string using a range loop
	fmt.Println("Rune values and characters in the string:")
	for index, runeValue := range str {
		fmt.Printf("Character: %c at index: %d has rune value: %U\n", runeValue, index, runeValue)
	}

	// Define a string that includes Unicode characters
	str2 := "Hello"

	// Iterate through the string using a range loop
	fmt.Println("Rune values and characters in the string 2:")
	for index, runeValue := range str2 {
		fmt.Printf("Character: %c at index: %d has rune value: %U\n", runeValue, index, runeValue)
	}

	// Map
	teams := map[string][]string{
		"Orcas": {"Fred", "Ralph", "Bijou"},
		"Lions": {"Fred2", "Ralph2", "Bijou"},
	}
	fmt.Printf("Teams: %v\n", teams)

	m := map[string]int{"one": 1, "two": 2, "three": 3}
	v, ok := m["two"]
	fmt.Println(v, ok)
	delete(m, "two")
	v, ok = m["two"]
	fmt.Println(v, ok)

	// Map for set
	intSet := map[int]bool{}
	vals := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	for _, v := range vals {
		intSet[v] = true
	}
	if intSet[9] {
		fmt.Println("9 is in the set")
	}

	type person struct {
		name string
		age  int
	}
	var people struct {
		name string
		age  int
	}
	people.name = "Fred"
	people.age = 20
	fmt.Println(people)

	p2 := person{name: "Mercury", age: 50}
	fmt.Println(p2)

	// 익명 구조체 비교
	type first struct {
		name string
		age  int
	}
	f := first{name: "Fred", age: 20}
	var g struct {
		name string
		age  int
	}
	g = f
	fmt.Println(f == g)
}
