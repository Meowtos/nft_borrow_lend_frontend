"use client"

function get(itemKey: string) {
    return localStorage.getItem(itemKey)
}

function set(itemKey: string, data: string) {
    localStorage.setItem(itemKey, data)
}

export const storage = {
    get,
    set
}