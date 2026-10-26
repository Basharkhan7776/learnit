package main

// Official Reference: https://go.dev/ref/spec#Switch_statements

import "testing"

func DayType(day string) string {
	switch day {
	case "Saturday", "Sunday":
		return "weekend"
	default:
		return "weekday"
	}
}

func TestDayType(t *testing.T) {
	if DayType("Saturday") != "weekend" || DayType("Sunday") != "weekend" {
		t.Errorf("expected weekend")
	}
	if DayType("Wednesday") != "weekday" {
		t.Errorf("expected weekday")
	}
}
