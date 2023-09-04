export const advice = `
  Die Antwort soll ein JSON Object enthalten, das wie folgt aufgebaut ist:

  {
    "success": boolean,
    "text: string,
    "geojson": object
  }

  Das Feld "success" soll angeben, ob zu dieser Frage ein räumlicher Bezug hergestellt werden konnte.
  Die Quelle für die Geometrie sollte im Idealfall openstreetmap sein.
  Die Koordinaten sollen immer vollständig in der Antwort enthalten sein.
  Das Geojson muss auf jeden Fall valide sein!
  Sollte kein direkter räumlicher Bezug hergestellt werden können, antworte wenn möglich trotzdem mit einem
  geojson Daten und erläutere im "text" Feld wie du dazu gekommen bist.

  Das Feld "text" soll deinen normalen Antwort text enthalten.

  Das Feld "geojson" soll die räumliche Repräsentation deiner Antwort enthalten.
  Die Properties der einzelnen Feature sollen nützlichen Informationen zu den entsprechenden Features enthalten.

  Die Frage lautet:
`;
