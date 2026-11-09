# IronLog – Gym Tracker (Version 0.1.0)

Mobile-first, offline-first Workout-Tracker als statische PWA für GitHub Pages.

## Starten
- `index.html` lokal über einen kleinen Webserver öffnen oder den Ordner auf GitHub Pages veröffentlichen.
- Für PWA-Installation und Service Worker ist HTTPS erforderlich (GitHub Pages liefert HTTPS).
- iPhone: Seite in Safari öffnen → Teilen → „Zum Home-Bildschirm“.
- Android: Chrome-Menü → „App installieren“ / „Zum Startbildschirm hinzufügen“.

## Was bereits funktioniert
- Lokale Datenspeicherung über IndexedDB (mit localStorage-Fallback)
- Workout starten, letzte Satzwerte als Vorschlag übernehmen, Sätze einzeln erfassen/abhaken, Übung hinzufügen/entfernen und Reihenfolge per Drag & Drop (Touch/Maus) oder Pfeilen ändern
- Manuell steuerbarer Pausentimer mit Standardzeit und Übungs-spezifischer Zeit
- Trainingspläne und Trainingstage erstellen/verwalten; Plan-Versionen bleiben als getrennte Pläne erhalten und nur eine Version je Planfamilie ist gleichzeitig aktiv
- Übungsbibliothek mit 69 Starter-Übungen, Suche, Filtern und eigenen Übungen
- Workout-Historie, Monatskalender, Trainingsvolumen, Kraftverlauf und Körperdaten
- JSON-Backup exportieren/importieren
- PWA-Manifest und Offline-App-Shell

## Noch nicht in 0.1.0 enthalten
- Supabase-Login und echte Cloud-Synchronisierung
- Konfliktfreie Synchronisierung mehrerer Geräte
- Cloud-zu-Lokal-Notfallwiederherstellung
- Vollständige englische UI-Übersetzung (Übungsnamen haben deutsche und englische Bezeichnungen)
- Übungsbilder (die Datenbank enthält aktuell Equipment-/Muskelgruppen-Infos; Bilder können in einem nächsten Schritt ergänzt werden)

## Cloud später ergänzen
Die Cloud wird bewusst nicht vorgetäuscht. Für Supabase werden später benötigt:
1. Supabase-Projekt
2. Tabellen und Row Level Security pro Benutzer
3. Authentifizierung
4. Sync-Queue und Konfliktstrategie (lokale Daten bleiben bis zur bestätigten Synchronisierung erhalten)

**Wichtig:** Niemals den `service_role`-Key in den Frontend-Code eintragen. Nur den öffentlichen anon/publishable key verwenden und RLS korrekt konfigurieren.
