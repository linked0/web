#!/usr/bin/env bash

# Script to recursively find files with given extensions (or all common text files with 'all'),
# merge them into a single file named "mergedTextFiles-<folder>.txt", and move it to a temp location,
# while excluding specified directories (default + any “!folder” args).

set -e

# --- Configuration ---
DIR_NAME="$(basename "$(pwd)")"
MERGED_FILENAME="mergedTextFiles-${DIR_NAME}.txt"
TEMP_SUBDIR="temp"
EXCLUDE_DIRS=(node_modules artifacts cache typechain-types .git .github)
# Default common text extensions
DEFAULT_TEXT_EXTENSIONS=(
  sh py rb js ts c h cpp cs go swift kt java scala groovy phar php
  html htm css scss sass less tsx jsx vue sol
  json yaml yml toml ini cfg xml csv
  txt md rst tex log
)

# --- Helpers ---
usage() {
  echo "Usage examples:"
  echo "  $0 txt md            # Merge only .txt and .md files"
  echo "  $0 all               # Merge all default text types"
  echo "  $0 all !vendor       # Merge all default text types, excluding 'vendor'"
  exit 1
}

if [[ $# -eq 0 ]] || [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
  usage
fi

# --- Parse Arguments ---
USER_EXTENSIONS=()
for arg in "$@"; do
  if [[ "$arg" == !* ]]; then
    excl="${arg#!}"
    [[ -n "$excl" ]] && EXCLUDE_DIRS+=("$excl")
  else
    ext="${arg#.}"
    [[ -n "$ext" ]] && USER_EXTENSIONS+=("$ext")
  fi
done

if [[ "${USER_EXTENSIONS[0]}" == "all" ]]; then
    echo "[INFO] Mode: Merging all common text files."
    EXTENSIONS=("${DEFAULT_TEXT_EXTENSIONS[@]}")
else
    echo "[INFO] Mode: Merging by specified extension(s)."
    EXTENSIONS=("${USER_EXTENSIONS[@]}")
fi

echo "[INFO] Including extensions: ${EXTENSIONS[*]}"
echo "[INFO] Excluding dirs:      ${EXCLUDE_DIRS[*]}"

# Build prune expression
PRUNE_EXPR=()
for d in "${EXCLUDE_DIRS[@]}"; do
  PRUNE_EXPR+=( -type d -name "$d" -prune -o )
done

# Prepare output paths
LOCAL_OUTPUT_PATH="$(pwd)/${MERGED_FILENAME}"
HOME_TEMP_DIR="${HOME}/${TEMP_SUBDIR}"
TEMP_OUTPUT_PATH="${HOME_TEMP_DIR}/${MERGED_FILENAME}"

echo "[INFO] Ensuring temp dir: ${HOME_TEMP_DIR}"
mkdir -p "${HOME_TEMP_DIR}"
rm -f "${LOCAL_OUTPUT_PATH}"
echo "[INFO] Cleared old output if present"

# Find and Merge
echo "[INFO] Searching in $(pwd) and merging into ${MERGED_FILENAME}..."
cnt=0

# Build name-test expression
NAME_EXPR=( -type f \( )
for i in "${!EXTENSIONS[@]}"; do
  NAME_EXPR+=( -iname "*.${EXTENSIONS[i]}" )
  [[ "$i" -lt $(( ${#EXTENSIONS[@]} - 1 )) ]] && NAME_EXPR+=( -o )
done
NAME_EXPR+=( \) )

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  echo -e "\n// ── ${file} ──────────────────────────────────────────────" \
    >> "${LOCAL_OUTPUT_PATH}"
  cat "${file}" >> "${LOCAL_OUTPUT_PATH}"
  cnt=$((cnt+1))
done < <(find . "${PRUNE_EXPR[@]}" "${NAME_EXPR[@]}" -print | sort)

if [[ "$cnt" -eq 0 ]]; then
  echo "[WARN] No matching files found to merge."
  rm -f "${LOCAL_OUTPUT_PATH}"
  exit 0
fi

echo "[INFO] Merged ${cnt} files → ${LOCAL_OUTPUT_PATH}"

echo "[INFO] Moving merged file to ${TEMP_OUTPUT_PATH}"
mv "${LOCAL_OUTPUT_PATH}" "${TEMP_OUTPUT_PATH}"

echo "[INFO] Done."
