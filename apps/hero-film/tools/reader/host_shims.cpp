#include "fixtures.hpp"
#include "logger/logger.hpp"
#include "esp_timer.h"
#include <ctime>
#include "film_clock.hpp"

// Same hardware-only shims as the existing display-theme harness. Production
// visual code, fonts, image descriptors and formatting run unchanged.
Logger::Logger(const char *name) : name(name) {}
int64_t esp_timer_get_time() { return static_cast<int64_t>(Fixtures::nowMs) * 1000; }
State::NetworkState State::getNetworkState() { return Fixtures::network; }
State::WebsocketState State::getWebsocketState() { return Fixtures::websocket; }
State::ApiState State::getApiState() { return Fixtures::api; }
WallClock::LocalTime WallClock::now() { return Fixtures::wallClock; }
void Logger::error(const char *) {}
void trimString(std::string &value) {
    const auto start = value.find_first_not_of(" \t\r\n");
    value = start == std::string::npos ? "" : value.substr(start, value.find_last_not_of(" \t\r\n") - start + 1);
}
// A controlled UTC epoch lets the production duration formatter show the
// start at 14:32 and, later, 24:00 elapsed, with no dependence on real time.
extern "C" time_t time(time_t *out)
#ifndef __APPLE__
noexcept
#endif
{
    const time_t now = FilmClock::epoch;
    if (out) *out = now;
    return now;
}
