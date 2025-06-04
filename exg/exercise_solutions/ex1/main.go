package main

import (
	"errors"
	"fmt"
	"reflect"
	"strconv"
)

type Person struct {
	Title      string `minStrlen:"1"`
	FirstName  string `minStrlen:"5"`
	MiddleName string
	LastName   string `minStrlen:"6"`
	Age        int
}

func main() {
	s := Person{
		Title:      "Mr.",
		FirstName:  "Jake",
		MiddleName: "Bobberick",
		LastName:   "Doe",
		Age:        25,
	}

	if err := ValidateStringLength(s); err != nil {
		fmt.Println(err)
	}
}

var ErrNotStruct = errors.New("not a struct")

func ValidateStringLength(toCheck any) error {
	t := reflect.TypeOf(toCheck)
	if t.Kind() != reflect.Struct {
		return ErrNotStruct
	}
	var foundErrors []error
	v := reflect.ValueOf(toCheck)
	for i := 0; i < t.NumField(); i++ {
		curField := t.Field(i)
		if curField.Type.Kind() != reflect.String {
			continue
		}
		tagVal, ok := curField.Tag.Lookup("minStrlen")
		if !ok {
			continue
		}
		minStrlen, err := strconv.Atoi(tagVal)
		if err != nil {
			foundErrors = append(foundErrors, err)
			continue
		}
		fieldLen := len(v.Field(i).String())
		if fieldLen < minStrlen {
			foundErrors = append(foundErrors,
				fmt.Errorf("length of field %s was %d; expected at least %d",
					curField.Name, fieldLen, minStrlen))
		}
	}
	if len(foundErrors) == 0 {
		return nil
	}
	return errors.Join(foundErrors...)
}
