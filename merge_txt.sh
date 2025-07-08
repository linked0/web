#!/usr/bin/env bash

# Script to recursively find all files with given extensions,
# merge them into a single file with headers, and move to a temp location,
# while excluding specified directories (default + any “!folder” args).

set -e

# --- Configuration ---
MERGED_FILENAME="mergedTextFiles.txt"
TEMP_SUBDIR="temp"
EXCLUDE_DIRS=(node_modules .git .github)

# --- Helpers ---
info()  { echo "[INFO]  $1"; }
warn()  { echo "[WARN]  $1"; }
error() { echo "[ERROR] $1" >&2; exit 1; }

# --- Parse Arguments ---
EXTENSIONS=()
for arg in "$@"; do
  if [[ "$arg" == !* ]]; then
    excl="${arg#!}"
    [ -n "$excl" ] && EXCLUDE_DIRS+=("$excl")
  else
    ext="${arg#.}"
    [ -n "$ext" ] && EXTENSIONS+=("$ext")
  fi
done

# 1. Validate
[ "${#EXTENSIONS[@]}" -gt 0 ] || error \
  "Usage: $0 <ext1> [ext2]… [!excludeDir1] [!excludeDir2]…
 e.g: $0 txt md sh \!build \!dist"

info "Including extensions: ${EXTENSIONS[*]}"
info "Excluding dirs:      ${EXCLUDE_DIRS[*]}"

# 2. Build prune expression
PRUNE_EXPR=()
for d in "${EXCLUDE_DIRS[@]}"; do
  PRUNE_EXPR+=( -type d -name "$d" -prune -o )
done

# 3. Build name-test expression
NAME_EXPR=( -type f \( )
for i in "${!EXTENSIONS[@]}"; do
  NAME_EXPR+=( -iname "*.${EXTENSIONS[i]}" )
  [ "$i" -lt $(( ${#EXTENSIONS[@]} - 1 )) ] && NAME_EXPR+=( -o )
done
NAME_EXPR+=( \) -print )

# 4. Gather files from the current directory
info "Searching in $(pwd)"
ALL_FILES=$(find . "${PRUNE_EXPR[@]}" "${NAME_EXPR[@]}" | sort)

[ -n "$ALL_FILES" ] || { warn "No matching files found."; exit 0; }

# 5. Prepare output paths
LOCAL_OUTPUT_PATH="$(pwd)/${MERGED_FILENAME}"
HOME_TEMP_DIR="${HOME}/${TEMP_SUBDIR}"
TEMP_OUTPUT_PATH="${HOME_TEMP_DIR}/${MERGED_FILENAME}"

# 6. Ensure temp dir exists
info "Ensuring temp dir: ${HOME_TEMP_DIR}"
mkdir -p "${HOME_TEMP_DIR}"

# 7. Remove any old output
rm -f "${LOCAL_OUTPUT_PATH}"
info "Cleared old output if present"

# 8. Merge
info "Merging files..."
cnt=0
while IFS= read -r file; do
  [ -z "$file" ] && continue
  echo -e "\n// ── ${file} ──────────────────────────────────────────────" \
    >> "${LOCAL_OUTPUT_PATH}"
  cat "${file}" >> "${LOCAL_OUTPUT_PATH}"
  cnt=$((cnt+1))
done <<< "$ALL_FILES"

info "Merged ${cnt} files → ${LOCAL_OUTPUT_PATH}"

# 9. Move to temp
info "Moving merged file to ${TEMP_OUTPUT_PATH}"
mv "${LOCAL_OUTPUT_PATH}" "${TEMP_OUTPUT_PATH}"

info "Done."
