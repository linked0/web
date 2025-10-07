#include <string.h>

int mini_calc(char *op, int a, int b) {
    if (strcmp(op, "+") == 0) {
        return a + b;
    }
    if (strcmp(op, "*") == 0) {
        return a * b;
    }
    if (strcmp(op, "-") == 0) {
        return a - b;
    }
    if (strcmp(op, "/") == 0) {
        if (b == 0) {
            return 0;
        }
        return a / b;
    }
    return 0;
}