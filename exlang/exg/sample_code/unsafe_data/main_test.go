package main

import (
	"testing"
)

var bh [dataSize]byte
var bhs []byte
var dh Data

var input = [dataSize]byte{0x0, 0x84, 0x5f, 0xed, 0x50, 0x68, 0x6f, 0x6e, 0x65, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1}
var inputSlice = []byte{0x0, 0x84, 0x5f, 0xed, 0x50, 0x68, 0x6f, 0x6e, 0x65, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1, 0x0}

var inputData = Data{
	Value:  8675309,
	Label:  [10]byte{80, 104, 111, 110, 101},
	Active: true,
}

func TestIdentical(t *testing.T) {
	b1 := BytesFromData(inputData)
	b2 := BytesFromDataUnsafe(inputData)
	if b1 != b2 {
		t.Fatal(b1, b2)
	}
	if b1 != input {
		t.Fatal(b1, input)
	}
	b3 := BytesFromDataUnsafeSlice(inputData)
	if *(*[dataSize]byte)(b3) != b2 {
		t.Fatal(b2, b3)
	}
	d1 := DataFromBytes(b1)
	d2 := DataFromBytesUnsafe(b1)
	if d1 != d2 {
		t.Fatal(d1, d2)
	}
	if d1 != inputData {
		t.Fatal(d1, inputData)
	}
	d3 := DataFromBytesUnsafeSlice(b3)
	if d3 != d2 {
		t.Fatal(d2, d3)
	}
}

func BenchmarkBytesFromData(b *testing.B) {
	for i := 0; i < b.N; i++ {
		bh = BytesFromData(inputData)
	}
}

func BenchmarkBytesFromDataUnsafe(b *testing.B) {
	for i := 0; i < b.N; i++ {
		bh = BytesFromDataUnsafe(inputData)
	}
}

func BenchmarkBytesFromDataUnsafeSlice(b *testing.B) {
	for i := 0; i < b.N; i++ {
		bhs = BytesFromDataUnsafeSlice(inputData)
	}
}

func BenchmarkDataFromBytes(b *testing.B) {
	for i := 0; i < b.N; i++ {
		dh = DataFromBytes(input)
	}
}

func BenchmarkDataFromBytesUnsafe(b *testing.B) {
	for i := 0; i < b.N; i++ {
		dh = DataFromBytesUnsafe(input)
	}
}

func BenchmarkDataFromBytesUnsafeSlice(b *testing.B) {
	for i := 0; i < b.N; i++ {
		dh = DataFromBytesUnsafeSlice(inputSlice)
	}
}
