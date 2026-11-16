#include "render_harness.hpp"
#include "display/screens/sessionSummary/sessionSummaryScreen.hpp"
#include <map>
#include "film_clock.hpp"

// Firmware currently has no locale switch. Only this optional English capture
// pass changes existing label text, in memory, after production construction.
// It never replaces layouts, widgets, colors, imagery, fonts or screen code.
const std::map<std::string, std::string> english = {
    {"Verfügbar", "Available"}, {"In Verwendung: Mia Chen", "In use: Mia Chen"},
    {"Bitte mit RFID \n        Karte/Tag anmelden", "Please sign in with\n        RFID card/tag"},
    {"Mittwoch, 14. Oktober", "Wednesday, 14 October"}, {"RFID-Karte auflegen", "Tap your RFID card"},
    {"Karte wird geprüft", "Checking card"}, {"Abmelden", "Sign out"},
    {"Ressource verwenden", "Start session"}, {"Sitzung beenden", "End session"},
    {"Startzeit", "Started"}, {"Nutzer", "User"}, {"Dauer", "Duration"},
    {"Aktuelle Nutzung", "Current usage"}, {"Zähler", "Meters"}, {"Betriebszeit", "Operating time"},
    {"Keine Daten", "No data"}, {"Warte auf Messwert", "Waiting for reading"},
    {"12:00 · Läuft", "12:00 · Running"},
    {"00:00 · Läuft", "00:00 · Running"},
    {"Projekt wählen", "Choose project"}, {"Nutzung gestartet", "Session started"},
    {"Nutzung beendet", "Session ended"}, {"Danke, Mia Chen!", "Thank you, Mia Chen!"},
    {"Abgerechnet", "Charged"}, {"Bis bald!", "See you soon!"},
    {"Sie benötigen eine Einweisung, bevor Sie diese Ressource nutzen können. Bitte wenden Sie sich an einen der unten aufgeführten Einweiser.",
     "You need an introduction before using this resource. Please contact one of the trainers listed below."},
    {"Aufsicht erforderlich", "Supervision required"},
    {"Aufsichts-Karte auflegen", "Tap supervisor's card"},
    {"Aufsicht kann auch im Web freigeben.", "A supervisor can also approve on the web."},
    {"Karte gelesen...\nbitte nicht bewegen", "Card read...\nplease hold still"},
    {"Freigegeben!", "Approved!"}, {"Abbrechen", "Cancel"},
    {"verbinde mit Netzwerk", "Connecting to network"},
    {"verbinde mit Server", "Connecting to server"},
    {"authentifiziere an API", "Authenticating with API"},
    {"Server: nicht konfiguriert", "Server: not configured"},
    {"Einstellungen", "Settings"},
    {"verbinde WLAN", "Connecting to WiFi"},
    {"verbinde Ethernet", "Connecting to Ethernet"},
    {"verbinde API", "Connecting to API"},
    {"Status: INIT  warte auf Netzwerk", "Status: INIT  waiting for network"},
};

void translate(lv_obj_t *obj) {
    if (lv_obj_check_type(obj, &lv_label_class)) {
        if (auto it = english.find(lv_label_get_text(obj)); it != english.end())
            lv_label_set_text(obj, it->second.c_str());
    }
    for (uint32_t i = 0; i < lv_obj_get_child_count(obj); ++i)
        translate(lv_obj_get_child(obj, i));
}

void dumpLabels(lv_obj_t *obj, std::ofstream &file) {
    if (lv_obj_check_type(obj, &lv_label_class) && lv_obj_is_visible(obj)) {
        lv_area_t a;
        lv_obj_get_coords(obj, &a);
        file << a.x1 << ',' << a.y1 << ',' << a.x2 << ',' << a.y2 << '\t'
             << lv_label_get_text(obj) << '\n';
    }
    for (uint32_t i = 0; i < lv_obj_get_child_count(obj); ++i)
        dumpLabels(lv_obj_get_child(obj, i), file);
}

int main(int argc, char **argv) {
    if (argc != 3 || (std::string(argv[2]) != "en" && std::string(argv[2]) != "de")) {
        std::cerr << "Usage: reader-film-host RAW_OUTPUT_DIR en|de\n";
        return 2;
    }
    try {
        Renderer renderer(argv[1]);
        const bool en = std::string(argv[2]) == "en";
        auto capture = [&](const char *name) {
            // Resolve production label geometry before reading DOT-mode text;
            // LVGL can temporarily insert ellipses during initial construction.
            settle();
            if (en) translate(lv_screen_active());
            renderer.capture(name);
            std::ofstream labels(renderer.output / (std::string(name) + ".labels.txt"));
            dumpLabels(lv_screen_active(), labels);
        };
        Fixtures::nowMs = 1000;
        Fixtures::wallClock = {true, 2026, 10, 14, 3, 14, 32};
        {
            Lockscreen lock;
            lock.setResourceName("Laser cutter");
            lock.setUsageInfo(false, "", false);
            lock.init();
            ScreenGuard guard(lock.getScreen(), &lock);
            capture("01-idle-ready");
            lock.showActionProgress();
            capture("02-authenticating");
            lock.hideActionProgress();
            lock.setUsageInfo(true, "Mia Chen", false);
            capture("04b-in-use-lockscreen");
        }
        {
            ResourceDetailsScreen details;
            API::ResourceBrief resource{};
            resource.id = 1;
            resource.isHealthy = true;
            resource.accessKnown = true;
            resource.hasIntroduction = true;
            resource.hasActiveUsage = true;
            resource.activeUsageId = 7;
            resource.activeStartEpoch = time(nullptr);
            resource.activeStartUtcOffsetMinutes = 120;
            std::strcpy(resource.name, "Laser cutter");
            std::strcpy(resource.activeUser, "Mia Chen");
            resource.description = "North Campus Prototyping Lab";
            details.setResourceAndUsageDetails(resource);
            details.setUserDetails({"Mia Chen", false, true, false, false});
            details.setSessionTimeoutTime(Fixtures::nowMs + 30000);
            details.init();
            ScreenGuard guard(details.getScreen(), &details);
            API::UsageStats stats{};
            stats.resourceId = 1;
            stats.usageId = 7;
            stats.meters = {{"Energy (kWh)", "0.000", -1, ""}};
            stats.operatingDurationMs = 0;
            stats.isOperating = 1;
            details.setUsageStats(stats);
            details.loop();
            details.showSuccessToast("Nutzung gestartet");
            capture("03-session-started");
            for (int i = 0; i < 80; ++i) { lv_tick_inc(16); lv_timer_handler(); }
            FilmClock::epoch += 24 * 60;
            details.setResourceAndUsageDetails(resource);
            stats.meters = {{"Energy (kWh)", "0.125", -1, ""}};
            stats.operatingDurationMs = 12 * 60 * 1000;
            details.setUsageStats(stats);
            details.loop();
            capture("04-session-active");
        }
        {
            SessionSummaryScreen summary;
            summary.setSummary("Mia Chen", 24 * 60, "");
            summary.init();
            ScreenGuard guard(summary.getScreen(), &summary);
            capture("05-session-ended");
        }
        {
            ResourceDetailsScreen details;
            API::ResourceBrief resource{};
            resource.id = 1;
            resource.isHealthy = true;
            resource.accessKnown = true;
            resource.introducers = {"Alex Morgan"};
            std::strcpy(resource.name, "Laser cutter");
            resource.description = "North Campus Prototyping Lab";
            details.setResourceAndUsageDetails(resource);
            details.setUserDetails({"Mia Chen", false, false, false, false});
            details.setSessionTimeoutTime(Fixtures::nowMs + 30000);
            details.init();
            ScreenGuard guard(details.getScreen(), &details);
            capture("06-access-denied-no-introduction");
        }
        {
            SupervisionScreen supervision;
            SupervisionScreen::View view;
            view.deadlineMs = Fixtures::nowMs + 30000;
            view.requesterName = "Mia Chen";
            view.supervisorHint = "Aufsicht kann auch im Web freigeben.";
            supervision.render(view);
            supervision.init();
            ScreenGuard guard(supervision.getScreen(), &supervision);
            capture("07-supervision-required");
        }
        {
            InitScreen init;
            init.init();
            ScreenGuard guard(init.getScreen(), &init);
            init.loop();
            capture("08-init-logo");
        }
        {
            BootScreen boot;
            boot.init();
            ScreenGuard guard(boot.getScreen(), &boot);
            capture("08b-boot-title");
        }
        expect(lvglErrors == 0, "No LVGL render errors");
        std::cout << "PASS " << renderer.captures << " production LVGL frames, " << checks << " checks\n";
    } catch (const std::exception &e) {
        std::cerr << "FAIL " << e.what() << '\n';
        return 1;
    }
}
