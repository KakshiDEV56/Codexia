package utils

import "time"

func GetStatus(start, end time.Time) string {
    now := time.Now()

    if now.Before(start) {
        return "upcoming"
    }
    if now.After(end) {
        return "past"
    }
    return "ongoing"
}