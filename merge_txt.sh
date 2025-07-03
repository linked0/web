#!/usr/bin/env bash

# Script to recursively find all text files in specified directories,
# merge them into a single file with headers, and copy to a temp location.

set -e

# --- Configuration ---
MERGED_FILENAME="mergedTextFiles.txt"
TEMP_SUBDIR="temp"

# --- Helper Functions ---
info() {
  echo "[INFO] $1"
}

warn() {
  echo "[WARN] $1"
}

error() {
  echo "[ERROR] $1" >&2
  exit 1
}

# --- Main Script ---

# 1. Check for at least one input directory argument
if [ "$#" -eq 0 ]; then
  error "Usage: $0 <source_directory1> [source_directory2] ..."
fi

# 2. Validate all provided directories exist
for DIR_NAME in "$@"; do
  if [ ! -d "$DIR_NAME" ]; then
    error "Source directory not found: ${DIR_NAME}"
  fi
done

# Paths for the merged output
CURRENT_DIR=$(pwd)
LOCAL_OUTPUT_PATH="${CURRENT_DIR}/${MERGED_FILENAME}"

HOME_TEMP_DIR="${HOME}/${TEMP_SUBDIR}"
TEMP_OUTPUT_PATH="${HOME_TEMP_DIR}/${MERGED_FILENAME}"

# 3. Ensure the temp directory exists
info "Ensuring temporary directory exists: ${HOME_TEMP_DIR}"
mkdir -p "${HOME_TEMP_DIR}"

# 4. Gather all files recursively from all specified directories (sorted), excluding node_modules
info "Gathering all files from: $@ (excluding node_modules)"
ALL_FILES=$(find "$@" \
  -type d -name "node_modules" -prune -o \
  -type f ! -path "*/node_modules/*" -print \
  | sort)

if [ -z "$ALL_FILES" ]; then
  warn "No files found in the specified directories: $@"
  exit 0
fi

# 5. Remove existing local output file
rm -f "${LOCAL_OUTPUT_PATH}"
info "Removed existing ${LOCAL_OUTPUT_PATH} if it existed."

# 6. Loop through each file, check if it's a text file, then merge
info "Processing and merging text files..."
FILE_COUNT=0

while IFS= read -r FILE_PATH; do
  # Skip empty lines
  [ -z "$FILE_PATH" ] && continue

  # Check MIME type to see if it starts with "text/"
  MIME_TYPE=$(file --mime-type -b "$FILE_PATH")
  if [[ "$MIME_TYPE" == text/* ]]; then
    echo -e "\n// ── ${FILE_PATH} ──────────────────────────────────────────────" >> "${LOCAL_OUTPUT_PATH}"
    cat "${FILE_PATH}" >> "${LOCAL_OUTPUT_PATH}"
    FILE_COUNT=$((FILE_COUNT + 1))
  fi
done <<< "${ALL_FILES}"

if [ "$FILE_COUNT" -eq 0 ]; then
  warn "No text files found in the specified directories: $@"
  exit 0
fi

# 7. Report merged file count
info "Merged ${FILE_COUNT} text files into ${LOCAL_OUTPUT_PATH}"

# 8. Copy merged file to ~/temp
info "Copying merged file to ${TEMP_OUTPUT_PATH}"
mv "${LOCAL_OUTPUT_PATH}" "${TEMP_OUTPUT_PATH}"

info "Script completed successfully."
