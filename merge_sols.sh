#!/usr/bin/env bash

# Script to recursively find all .sol files in a specified directory,
# merge them into a single file with headers, and copy to a temp location.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The local output file name
MERGED_FILENAME="mergedSol.txt"
# The temporary directory under the user's home
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

# 1. Check for input directory argument
if [ -z "$1" ]; then
  error "Usage: $0 <source_directory>"
fi

SOURCE_DIR_NAME="$1"

# Check if the source directory exists
if [ ! -d "$SOURCE_DIR_NAME" ]; then
  error "Source directory not found: ${SOURCE_DIR_NAME}"
fi

# Define output paths
# Script's current execution directory
CURRENT_DIR=$(pwd)
LOCAL_OUTPUT_PATH="${CURRENT_DIR}/${MERGED_FILENAME}"

# User's home temporary directory
HOME_TEMP_DIR="${HOME}/${TEMP_SUBDIR}"
TEMP_OUTPUT_PATH="${HOME_TEMP_DIR}/${MERGED_FILENAME}"

# 2. Ensure the temp directory in the home folder exists
info "Ensuring temporary directory exists: ${HOME_TEMP_DIR}"
mkdir -p "${HOME_TEMP_DIR}"

# 3. Gather all .sol files recursively and sort them
info "Gathering .sol files from: ${SOURCE_DIR_NAME}"
# Using null-terminated strings with find and sort for robustness with special filenames
# However, the while read loop below doesn't handle null-terminated lines by default easily with `read -d ''`
# For simplicity and common use cases, we'll use newline-separated paths.
# If filenames with newlines are a concern, a more complex approach would be needed.
SOL_FILES=$(find "${SOURCE_DIR_NAME}" -type f -name "*.sol" | sort)

if [ -z "$SOL_FILES" ]; then
  warn "No .sol files found in ${SOURCE_DIR_NAME}"
  exit 0
fi

# 4. Remove existing local output file to start fresh
rm -f "${LOCAL_OUTPUT_PATH}"
info "Removed existing ${LOCAL_OUTPUT_PATH} if it existed."

# 5. Read and prepend header comment for each file, then append content
info "Processing and merging files..."
FILE_COUNT=0
while IFS= read -r FILE_PATH; do
  if [ -n "$FILE_PATH" ]; then # Ensure FILE_PATH is not empty
    # The FILE_PATH from find might be relative to SOURCE_DIR_NAME or absolute
    # The original JS used path.relative(process.cwd(), filePath).
    # If SOURCE_DIR_NAME is relative (e.g. "src"), then FILE_PATH will be like "src/file.sol"
    # which is already relative to CURRENT_DIR. This should suffice.
    HEADER_PATH="${FILE_PATH}"

    echo -e "\n// ── ${HEADER_PATH} ──────────────────────────────────────────────" >> "${LOCAL_OUTPUT_PATH}"
    cat "${FILE_PATH}" >> "${LOCAL_OUTPUT_PATH}"
    FILE_COUNT=$((FILE_COUNT + 1))
  fi
done <<< "${SOL_FILES}" # Process substitution to feed the command output to the loop

# 6. Report merged file count and local output path
info "Merged ${FILE_COUNT} files into ${LOCAL_OUTPUT_PATH}"

# 7. Copy merged file to ~/temp
info "Copying merged file to ${TEMP_OUTPUT_PATH}"
cp "${LOCAL_OUTPUT_PATH}" "${TEMP_OUTPUT_PATH}"
info "Copied merged file to ${TEMP_OUTPUT_PATH}"

info "Script completed successfully."