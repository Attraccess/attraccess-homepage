cmake_minimum_required(VERSION 3.24)
project(hero_reader LANGUAGES C CXX ASM)
set(CMAKE_CXX_STANDARD 20)
get_filename_component(WORKSPACE "${CMAKE_CURRENT_SOURCE_DIR}/../../.." ABSOLUTE)
set(FIRMWARE "${WORKSPACE}/software/apps/attractap/firmware")
set(HARNESS "${FIRMWARE}/tests/display-theme")
# Reuse the original pinned LVGL configuration, production source list, raw
# image embedding and fonts. No files in software/ are changed or copied.
add_subdirectory("${HARNESS}" "${CMAKE_CURRENT_BINARY_DIR}/production-harness")
get_target_property(UPSTREAM_SOURCES display-theme-host SOURCES)
set(PRODUCTION_SOURCES)
foreach(SOURCE IN LISTS UPSTREAM_SOURCES)
  if(IS_ABSOLUTE "${SOURCE}")
    list(APPEND PRODUCTION_SOURCES "${SOURCE}")
  endif()
endforeach()
add_executable(reader-film-host main.cpp host_shims.cpp ${PRODUCTION_SOURCES}
  "${FIRMWARE}/src/display/screens/sessionSummary/sessionSummaryScreen.cpp")
add_dependencies(reader-film-host display-theme-host)
target_include_directories(reader-film-host PRIVATE "${HARNESS}" "${HARNESS}/shims" "${FIRMWARE}/src")
target_compile_definitions(reader-film-host PRIVATE
  "FIRMWARE_FRIENDLY_NAME=\"Attractap Touch\"" FIRMWARE_VERSION="1.6.4"
  FIRMWARE_VARIANT_FRIENDLY_NAME="WiFi" PIN_ETH_SPI_CS=-1
  DEMO_MODE=1 LOGGER_LEVEL_NUM=0)
target_link_libraries(reader-film-host PRIVATE lvgl::lvgl)
# Two nonvisual production formatter functions are extracted verbatim at
# configure time; other hardware/transport functions in utils.cpp aren't linked.
file(READ "${FIRMWARE}/src/utils.cpp" UTILS)
string(FIND "${UTILS}" "std::string millisToTimeString(double millis)" FORMAT_START)
string(FIND "${UTILS}" "static bool parseTwoDigits" FORMAT_END)
math(EXPR FORMAT_LENGTH "${FORMAT_END} - ${FORMAT_START}")
string(SUBSTRING "${UTILS}" ${FORMAT_START} ${FORMAT_LENGTH} FORMATTERS)
file(WRITE "${CMAKE_CURRENT_BINARY_DIR}/formatters.cpp" "#include <string>\n#include <ctime>\n#include <cstdio>\n${FORMATTERS}")
target_sources(reader-film-host PRIVATE "${CMAKE_CURRENT_BINARY_DIR}/formatters.cpp")
enable_testing()
