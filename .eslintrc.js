module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint",
        "import"
    ],
    "rules": {
        "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                    "object",
                    "type"
                ],
                "pathGroups": [
                    {
                        "pattern": "react*",
                        "group": "builtin"
                    },
                    {
                        "pattern": "@/*",
                        "group": "internal",
                        "position": "after"
                    }
                ],
                "newlines-between": "always",
                "pathGroupsExcludedImportTypes": [
                    "react*"
                ],
                "alphabetize": {
                    "order": "asc"
                }
            }
        ]
    }
};