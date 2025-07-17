#!/usr/bin/env bash

# Script to recursively find all files with given extensions (or all common text files by default or with '*'),
# merge them into a single file with headers, and move to a temp location,
# while excluding specified directories (default + any “!folder” args).

set -e

# --- Configuration ---
MERGED_FILENAME="mergedTextFiles.txt"
TEMP_SUBDIR="temp"
EXCLUDE_DIRS=(node_modules .git .github)
# Define what '*' or no-args expands to. Add or remove extensions as needed.
DEFAULT_TEXT_EXTENSIONS=(
  # Scripting & Code
  sh py rb js ts c h cpp cs go swift kt java scala groovy phar php
  # Web
  html htm css scss sass less tsx jsx vue
  # Config & Data
  json yaml yml toml ini cfg xml csv
  # Docs & Text
  txt md rst tex log
)


# --- Helpers ---
info()  { echo "[INFO]  $1"; }
warn()  { echo "[WARN]  $1"; }
error() { echo "[ERROR] $1" >&2; exit 1; }

# --- Parse Arguments ---
USER_EXTENSIONS=()
# We process all args, separating extensions from !exclusions
for arg in "$@"; do
  if [[ "$arg" == !* ]]; then
    excl="${arg#!}"
    [ -n "$excl" ] && EXCLUDE_DIRS+=("$excl")
  else
    ext="${arg#.}"
    [ -n "$ext" ] && USER_EXTENSIONS+=("$ext")
  fi
done

# 1. Determine mode: Default to all text files if no extensions are given or if '*' is the first one.
# Usage: $0 [ext1|*] [ext2]… [!excludeDir1] [!excludeDir2]…
# e.g: $0 (merges all default text types)
# e.g: $0 '*' !vendor (merges all default text types, excludes vendor)
# e.g: $0 txt md sh !build !dist (merges only specified types)
if [ "${#USER_EXTENSIONS[@]}" -eq 0 ] || [[ "${USER_EXTENSIONS[0]}" == "*" ]]; then
    info "Mode: Merging all common text files (default behavior)."
    EXTENSIONS=( "${DEFAULT_TEXT_EXTENSIONS[@]}" )
else
    info "Mode: Merging by specified extension(s)."
    EXTENSIONS=( "${USER_EXTENSIONS[@]}" )
fi

info "Including extensions: ${EXTENSIONS[*]}"
info "Excluding dirs:      ${EXCLUDE_DIRS[*]}"

# 2. Build prune expression for find
PRUNE_EXPR=()
for d in "${EXCLUDE_DIRS[@]}"; do
  # -o is OR. The expression means: if it's a directory with this name, prune it, OR continue.
  PRUNE_EXPR+=( -type d -name "$d" -prune -o )
done

# 3. Prepare output paths
LOCAL_OUTPUT_PATH="$(pwd)/${MERGED_FILENAME}"
HOME_TEMP_DIR="${HOME}/${TEMP_SUBDIR}"
TEMP_OUTPUT_PATH="${HOME_TEMP_DIR}/${MERGED_FILENAME}"

# 4. Ensure temp dir exists and clear old output
info "Ensuring temp dir: ${HOME_TEMP_DIR}"
mkdir -p "${HOME_TEMP_DIR}"
rm -f "${LOCAL_OUTPUT_PATH}"
info "Cleared old output if present"

# 5. Find and Merge
info "Searching in $(pwd) and merging..."
cnt=0

# Build name-test expression to filter by extension.
NAME_EXPR=( -type f \( )
for i in "${!EXTENSIONS[@]}"; do
  NAME_EXPR+=( -iname "*.${EXTENSIONS[i]}" )
  [ "$i" -lt $(( ${#EXTENSIONS[@]} - 1 )) ] && NAME_EXPR+=( -o )
done
NAME_EXPR+=( \) )

# Find files matching extensions and pipe them to the merge loop.
while IFS= read -r file; do
  [ -z "$file" ] && continue
  echo -e "\n// ── ${file} ──────────────────────────────────────────────" >> "${LOCAL_OUTPUT_PATH}"
  cat "${file}" >> "${LOCAL_OUTPUT_PATH}"
  cnt=$((cnt+1))
done < <(find . "${PRUNE_EXPR[@]}" "${NAME_EXPR[@]}" -print | sort)


# 6. Check if any files were actually merged
if [ "$cnt" -eq 0 ]; then
  warn "No matching files found to merge."
  # Clean up the empty merged file that might have been created
  rm -f "${LOCAL_OUTPUT_PATH}"
  exit 0
fi

info "Merged ${cnt} files → ${LOCAL_OUTPUT_PATH}"

# 7. Move to temp
info "Moving merged file to ${TEMP_OUTPUT_PATH}"
mv "${LOCAL_OUTPUT_PATH}" "${TEMP_OUTPUT_PATH}"

info "Done."
