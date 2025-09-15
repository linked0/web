#!/usr/bin/env bash

# Script to recursively find files with given extensions (or all common text files with 'all'),
# merge them into a single file named "mergedTextFiles-<folder>.txt", and move it to a destination,
# while excluding specified directories (default + any “!folder” args).

set -e

# --- Configuration ---
DIR_NAME="$(basename $(pwd))"
MERGED_FILENAME="merged-${DIR_NAME}.txt"
TEMP_SUBDIR="temp"
EXCLUDE_DIRS=(node_modules artifacts/@openzeppelin artifacts/hardhat cache typechain-types/@openzeppelin typechain-types/factories  .git .github)
# Default common text extensions
DEFAULT_TEXT_EXTENSIONS=(
  sh py rb js ts c h cpp cs go swift kt java scala groovy phar php
  html htm css scss sass less tsx jsx vue sol
  json yaml yml toml ini cfg xml csv
  txt md rst tex log
)

# --- Helpers ---
usage() {
  echo "Usage: $0 [options] [extensions... | all] [!exclusions...]"
  echo
  echo "Arguments:"
  echo "  extensions      List of file extensions to merge (e.g., txt md sh)."
  echo "  all             A special keyword to include all common text file extensions."
  echo "  !exclusions     Directories to exclude, prefixed with '!' (e.g., !vendor !logs)."
  echo
  echo "Options:"
  echo "  -d, --dest <dir>  Specify the destination directory for the merged file."
  echo "                    (Default: ~/${TEMP_SUBDIR}/)"
  echo "  -h, --help        Show this help message."
  echo
  echo "Examples:"
  echo "  $0 txt md                     # Merge .txt and .md files into ~/${TEMP_SUBDIR}/"
  echo "  $0 all !vendor                # Merge all default types into ~/${TEMP_SUBDIR}/, excluding 'vendor'"
  echo "  $0 sol -d ./output            # Merge .sol files into the ./output/ directory"
  exit 1
}

if [[ $# -eq 0 ]] || [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
  usage
fi

# --- Parse Arguments ---
USER_EXTENSIONS=()
DESTINATION_DIR=""

while [[ $# -gt 0 ]]; do
  arg="$1"
  case "$arg" in
    -d|--dest)
      DESTINATION_DIR="$2"
      if [[ -z "$DESTINATION_DIR" ]] || [[ "$DESTINATION_DIR" == !* ]] && [[ ! "$DESTINATION_DIR" =~ ^[a-zA-Z0-9] ]]; then
        echo "[ERROR] A valid destination directory must be specified after the '$1' option."
        usage
      fi
      shift # past argument
      shift # past value
      ;;
    !*)
      excl="${arg#!}"
      [[ -n "$excl" ]] && EXCLUDE_DIRS+=("$excl")
      shift # past argument
      ;;
    *)
      ext="${arg#.}"
      [[ -n "$ext" ]] && USER_EXTENSIONS+=("$ext")
      shift # past argument
      ;;
  esac
done


if [[ ${#USER_EXTENSIONS[@]} -eq 0 ]]; then
  echo "[ERROR] No file extensions specified."
  usage
fi


if [[ "${USER_EXTENSIONS[0]}" == "all" ]]; then
    echo "[INFO] Mode: Merging all common text files."
    EXTENSIONS=("${DEFAULT_TEXT_EXTENSIONS[@]}")
else
    echo "[INFO] Mode: Merging by specified extension(s)."
    EXTENSIONS=("${USER_EXTENSIONS[@]}")
fi

echo "[INFO] Including extensions: ${EXTENSIONS[*]}"
echo "[INFO] Excluding dirs:      ${EXCLUDE_DIRS[*]}"

# Build prune expression for find command
PRUNE_EXPR=()
for d in "${EXCLUDE_DIRS[@]}"; do
  PRUNE_EXPR+=( -type d -name "$d" -prune -o )
done
NAME_EXPR+=( \) )

# Prepare output paths
if [[ -z "$DESTINATION_DIR" ]]; then
  FINAL_DEST_DIR="${HOME}/${TEMP_SUBDIR}"
  echo "[INFO] No destination specified, using default: ${FINAL_DEST_DIR}"
else
  FINAL_DEST_DIR="${DESTINATION_DIR}"
  echo "[INFO] Using specified destination: ${FINAL_DEST_DIR}"
fi

LOCAL_OUTPUT_PATH="$(pwd)/${MERGED_FILENAME}"
FINAL_OUTPUT_PATH="${FINAL_DEST_DIR}/${MERGED_FILENAME}"

echo "[INFO] Ensuring destination dir exists: ${FINAL_DEST_DIR}"
mkdir -p "${FINAL_DEST_DIR}"
rm -f "${LOCAL_OUTPUT_PATH}"
echo "[INFO] Cleared old local output if present"

# Find and Merge
echo "[INFO] Searching in $(pwd) and merging into ${MERGED_FILENAME}..."
cnt=0

# Build name-test expression for find command
NAME_EXPR=( -type f \( )
for i in "${!EXTENSIONS[@]}"; do
  NAME_EXPR+=( -iname "*.${EXTENSIONS[i]}" )
  [[ "$i" -lt $(( ${#EXTENSIONS[@]} - 1 )) ]] && NAME_EXPR+=( -o )
done
NAME_EXPR+=( \) )

while IFS= read -r file; do
  skip=false
  for excl in "${EXCLUDE_DIRS[@]}"; do
    [[ "$file" == ./$excl/* || "$file" == ./$excl ]] && skip=true && break
  done
  $skip && continue
  echo -e "\n// ── ${file} ──────────────────────────────────────────────" >> "${LOCAL_OUTPUT_PATH}"
  cat "$file" >> "${LOCAL_OUTPUT_PATH}"
  cnt=$((cnt+1))
done < <(find . -type f "${NAME_EXPR[@]}" -print | sort)

if [[ "$cnt" -eq 0 ]]; then
  echo "[WARN] No matching files found to merge."
  rm -f "${LOCAL_OUTPUT_PATH}"
  exit 0
fi

echo "[INFO] Merged ${cnt} files → ${LOCAL_OUTPUT_PATH}"

echo "[INFO] Moving merged file to ${FINAL_OUTPUT_PATH}"
mv "${LOCAL_OUTPUT_PATH}" "${FINAL_OUTPUT_PATH}"

echo "[INFO] Done."
