const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, PageBreak, Footer, PageNumber,
} = require("docx");
const fs = require("fs");

// ---------- helpers ----------

// "**fett** normal" -> [TextRun bold, TextRun]
function runs(text, opts = {}) {
  const out = [];
  text.split("**").forEach((part, i) => {
    if (part === "") return;
    out.push(new TextRun({ text: part, bold: i % 2 === 1, ...opts }));
  });
  return out.length ? out : [new TextRun({ text: "", ...opts })];
}

const P = (text, opts = {}) =>
  new Paragraph({
    children: runs(text, opts.run || {}),
    spacing: { after: opts.after ?? 120, line: 276 },
    alignment: opts.alignment,
    indent: opts.indent,
    border: opts.border,
    shading: opts.shading,
    keepNext: opts.keepNext,
  });

// § heading
const H = (text) =>
  new Paragraph({
    children: runs(text),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 140 },
    keepNext: true,
  });

const H1 = (text) =>
  new Paragraph({
    children: runs(text),
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    keepNext: true,
  });

// numbered clause "(1) ..."
const N = (n, text) =>
  P(`(${n})\t${text}`, { indent: { left: 454, hanging: 454 } });

// lettered sub-item "a) ..."
const L = (letter, text) =>
  P(`${letter})\t${text}`, { indent: { left: 907, hanging: 340 }, after: 60 });

// plain paragraph without numbering, aligned with clause text
const PI = (text) => P(text, { indent: { left: 454 } });

const HR = () =>
  new Paragraph({
    text: "",
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "BFBFBF", space: 6 } },
  });

const SPACER = (after = 200) => new Paragraph({ text: "", spacing: { after } });

// ---------- document content ----------

const children = [];

// Title
children.push(
  new Paragraph({
    children: [new TextRun({ text: "Gesellschaftsvertrag", bold: true, size: 40 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "der Bisnero GbR", bold: true, size: 32 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "— VERTRAGSENTWURF —", bold: true, size: 24, color: "8B0000" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 260 },
  }),
);

// Hint box
children.push(
  new Paragraph({
    children: runs(
      "**Hinweis:** Dies ist ein Entwurf und keine Rechtsberatung. Er ist bewusst einfach gehalten und auf die Situation von drei gleichberechtigten Gründern zugeschnitten. Vor der Unterschrift sollte der Vertrag von einer Rechtsanwältin oder einem Rechtsanwalt (Gesellschaftsrecht) und steuerlich von einem Steuerberater geprüft werden. Der Entwurf beruht auf deutschem Recht in der seit dem 01.01.2024 geltenden Fassung der §§ 705 ff. BGB (MoPeG).",
      { size: 20 },
    ),
    spacing: { before: 120, after: 320, line: 260 },
    shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
    indent: { left: 170, right: 170 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF", space: 8 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF", space: 8 },
      left: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF", space: 8 },
      right: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF", space: 8 },
    },
  }),
);

// Präambel
children.push(H1("Präambel"));
children.push(
  P("Fernando Hener, Romeo Reich und Diel Bislimi sind Freunde und wollen gemeinsam unter dem Namen Bisnero ein kleines Unternehmen aufbauen. Bisnero erstellt und verkauft Websites und vertreibt Google Review Cards sowie weitere digitale Produkte und Dienstleistungen."),
  P("Die Gesellschafter sind sich einig, dass sie vollständig gleichberechtigt zusammenarbeiten, Entscheidungen gemeinsam treffen und Gewinne und Verluste zu gleichen Teilen tragen. Dieser Vertrag soll die Punkte regeln, bei denen später Missverständnisse oder Streit entstehen könnten – nicht mehr und nicht weniger. Er beruht auf gegenseitigem Vertrauen und dem Willen, offene Fragen zuerst im Gespräch zu klären."),
  P("Die Gewerbeanmeldung ist für den **24.08.2026, 11:00 Uhr**, beim zuständigen Gewerbeamt vorgesehen."),
  HR(),
);

// § 1
children.push(H("§ 1 Name, Rechtsform, Sitz"));
children.push(
  N(1, "Die Gesellschafter gründen eine Gesellschaft bürgerlichen Rechts (GbR) nach §§ 705 ff. BGB."),
  N(2, "Die Gesellschaft führt im Geschäftsverkehr die Bezeichnung **„Bisnero GbR“**. Diese Bezeichnung ist keine Firma im Sinne des HGB; im Rechtsverkehr treten die Gesellschafter unter Angabe ihrer Namen und der Bezeichnung „Bisnero GbR“ auf."),
  N(3, "Sitz der Gesellschaft ist **[ORT]**. Die Geschäftsanschrift lautet **[GESCHÄFTSANSCHRIFT]**."),
  N(4, "Eine Eintragung in das Gesellschaftsregister (dann: „Bisnero eGbR“) ist derzeit nicht vorgesehen. Die Gesellschafter können die Eintragung jederzeit einstimmig beschließen; sie ist unter anderem erforderlich, wenn die Gesellschaft Grundstücke, GmbH-Anteile oder eingetragene Rechte erwerben soll."),
);

// § 2 with table
children.push(H("§ 2 Gesellschafter"));
children.push(P("Gesellschafter sind:", { after: 140 }));

const COLS = [640, 2500, 4000, 1886]; // = 9026 dxa content width
const cell = (text, bold = false, width) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    shading: bold ? { type: ShadingType.CLEAR, fill: "F2F2F2" } : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold, size: 20 })],
        spacing: { after: 0, line: 240 },
      }),
    ],
  });

const row = (cells, bold = false) =>
  new TableRow({
    tableHeader: bold,
    children: cells.map((t, i) => cell(t, bold, COLS[i])),
  });

children.push(
  new Table({
    columnWidths: COLS,
    width: { size: 9026, type: WidthType.DXA },
    rows: [
      row(["Nr.", "Name", "Anschrift", "Geburtsdatum"], true),
      row(["1", "Fernando Hener", "Euzinger Str. 19, 76829 Landau", "[GEBURTSDATUM]"]),
      row(["2", "Romeo Reich", "Hauptstraße 25, 76831 Birkweiler", "[GEBURTSDATUM]"]),
      row(["3", "Diel Bislimi", "Türkheimerstraße 41, 76829 Landau", "[GEBURTSDATUM]"]),
    ],
  }),
  SPACER(140),
  P("Alle Gesellschafter sind volljährig und unbeschränkt geschäftsfähig."),
);

// § 3
children.push(H("§ 3 Gegenstand des Unternehmens"));
children.push(
  N(1, "Gegenstand der Gesellschaft sind die Entwicklung, Herstellung, der Vertrieb und die Betreuung digitaler Produkte und Dienstleistungen, insbesondere:"),
  L("a", "die Erstellung, der Verkauf, die Pflege und die Wartung von Websites sowie Webdesign und Webentwicklung;"),
  L("b", "die Entwicklung, Herstellung und der Vertrieb von Google Review Cards und vergleichbaren Produkten, die der Gewinnung, Vereinfachung oder Förderung von Kundenbewertungen dienen – sowohl als eigenständiges Produkt als auch in Verbindung mit Websites oder anderen Leistungen der Gesellschaft;"),
  L("c", "die Entwicklung, Vermarktung und der Verkauf sonstiger digitaler Produkte, Vorlagen, Software und Online-Angebote;"),
  L("d", "digitale Dienstleistungen aller Art, insbesondere Beratung, Betreuung, Support, Online-Marketing und damit zusammenhängende Leistungen;"),
  L("e", "der Handel mit sowie die Vermittlung von Waren und Dienstleistungen, die mit den vorstehenden Bereichen in Zusammenhang stehen."),
  N(2, "Die unter Absatz 1 lit. a) und lit. b) genannten Bereiche – Websites einerseits, Google Review Cards andererseits – sind **gleichrangige, eigenständige Geschäftsbereiche** der Gesellschaft. Die Google Review Cards können unabhängig von Website-Aufträgen angeboten und verkauft werden; ein bestimmtes Verhältnis der Geschäftsbereiche zueinander ist nicht vereinbart."),
  N(3, "Die Gesellschaft ist berechtigt, alle Geschäfte zu betreiben, die dem Gesellschaftszweck unmittelbar oder mittelbar dienen, und ihr Angebot innerhalb dieses Rahmens jederzeit zu erweitern, zu verändern oder einzuschränken; einer Änderung dieses Vertrages bedarf es dafür nicht."),
  N(4, "Tätigkeiten, die einer behördlichen Erlaubnis bedürfen, werden nur nach Erteilung der erforderlichen Erlaubnis ausgeübt."),
);

// § 4
children.push(H("§ 4 Beginn, Dauer, Geschäftsjahr"));
children.push(
  N(1, "Die Gesellschaft beginnt mit Unterzeichnung dieses Vertrages, im Außenverhältnis spätestens mit Aufnahme der Geschäftstätigkeit."),
  N(2, "Die Gesellschaft wird auf unbestimmte Zeit geschlossen."),
  N(3, "Geschäftsjahr ist das Kalenderjahr. Das erste Geschäftsjahr ist ein Rumpfgeschäftsjahr und endet am 31.12. des Gründungsjahres."),
);

// § 5
children.push(H("§ 5 Beiträge der Gesellschafter"));
children.push(
  N(1, "Jeder Gesellschafter bringt seine Arbeitskraft in dem Umfang ein, den die Gesellschaft benötigt und der ihm neben seinen sonstigen Verpflichtungen möglich ist. Eine feste Arbeitszeit ist nicht vereinbart."),
  N(2, "Bareinlagen werden in folgender Höhe geleistet: Fernando Hener **[BETRAG] €**, Romeo Reich **[BETRAG] €**, Diel Bislimi **[BETRAG] €**. Sind keine Beträge eingetragen, sind Bareinlagen nicht geschuldet."),
  N(3, "Weitere Einzahlungen oder Nachschüsse können nur einstimmig beschlossen werden. Ohne einen solchen Beschluss ist kein Gesellschafter zu weiteren Zahlungen verpflichtet."),
  N(4, "Für die Arbeitsleistung wird zunächst keine Vergütung gezahlt. Eine Vergütung oder eine Erstattung einzelner Tätigkeiten kann jederzeit einstimmig beschlossen werden."),
);

// § 6
children.push(H("§ 6 Gleichberechtigung, Stimmrecht, Beschlüsse"));
children.push(
  N(1, "Die Gesellschafter sind vollständig gleichberechtigt. Jeder Gesellschafter hat **eine Stimme**. Sonderstimmrechte, Stichentscheide oder Vorrechte einzelner Gesellschafter bestehen nicht. Insbesondere begründet die Übernahme bestimmter Aufgaben (§ 8) keine weitergehenden Entscheidungs- oder Vermögensrechte."),
  N(2, "Beschlüsse in wichtigen Angelegenheiten werden **einstimmig** gefasst, also von allen Gesellschaftern gemeinsam. Wichtige Angelegenheiten sind insbesondere:"),
  L("a", "Aufnahme neuer Gesellschafter und Übertragung von Gesellschaftsanteilen;"),
  L("b", "Änderungen dieses Vertrages sowie eine Änderung von Rechtsform oder Gesellschaftszweck;"),
  L("c", "Aufnahme von Krediten, Eingehen von Dauerschuldverhältnissen mit einer Laufzeit von mehr als zwölf Monaten sowie Verträge mit erheblicher wirtschaftlicher Bedeutung für die Gesellschaft;"),
  L("d", "größere oder für die Gesellschaft bedeutsame Anschaffungen und Ausgaben (§ 9);"),
  L("e", "Einstellung von Mitarbeitern sowie dauerhafte Beauftragung von Dienstleistern;"),
  L("f", "Gewinnverwendung, Entnahmen und Vergütungen;"),
  L("g", "Aufgabe oder wesentliche Veränderung eines der Geschäftsbereiche nach § 3 Abs. 1 lit. a) oder lit. b);"),
  L("h", "Auflösung der Gesellschaft."),
  N(3, "Alle übrigen, laufenden Angelegenheiten kann jeder Gesellschafter im Rahmen seiner Aufgaben eigenständig erledigen (§ 7)."),
  N(4, "Kommt in einer wichtigen Angelegenheit keine Einigkeit zustande, wird die Maßnahme **nicht durchgeführt**, bis sich die Gesellschafter geeinigt haben. Bis dahin bleibt es beim bisherigen Zustand. Eine weitergehende Konfliktregelung ist bewusst nicht vereinbart; die Gesellschafter verpflichten sich, Meinungsverschiedenheiten zuerst persönlich und in angemessener Zeit zu besprechen."),
  N(5, "Beschlüsse können in jeder Form gefasst werden – auch mündlich, per Telefonat, Videokonferenz, Messenger oder E-Mail. Beschlüsse zu Angelegenheiten nach Absatz 2 lit. a), b) und h) sind schriftlich oder in Textform zu dokumentieren."),
);

// § 7
children.push(H("§ 7 Geschäftsführung und Vertretung"));
children.push(
  N(1, "Die Geschäftsführung steht allen Gesellschaftern gemeinsam zu. Im Rahmen der übernommenen Aufgaben (§ 8) und des laufenden Geschäftsbetriebs handelt jeder Gesellschafter allein; wichtige Angelegenheiten (§ 6 Abs. 2) bleiben der gemeinsamen Entscheidung vorbehalten."),
  N(2, "Widerspricht ein Gesellschafter einer Maßnahme, bevor sie ausgeführt ist, hat sie zu unterbleiben, bis eine gemeinsame Entscheidung getroffen ist."),
  N(3, "Im Außenverhältnis vertreten die Gesellschafter die Gesellschaft gemeinsam. Für Geschäfte des laufenden Betriebs im Rahmen der eigenen Aufgaben ist jeder Gesellschafter einzeln zur Vertretung berechtigt."),
  N(4, "Den Gesellschaftern ist bekannt, dass sie für Verbindlichkeiten der Gesellschaft persönlich und gesamtschuldnerisch mit ihrem Privatvermögen haften und dass interne Absprachen diese Haftung gegenüber Dritten nicht einschränken."),
  N(5, "Jeder Gesellschafter informiert die anderen unverzüglich über alles, was für die Gesellschaft wesentlich ist. Jeder Gesellschafter kann jederzeit Auskunft über die Angelegenheiten der Gesellschaft verlangen und die Unterlagen einsehen."),
);

// § 8
children.push(H("§ 8 Aufgabenverteilung"));
children.push(
  N(1, "Eine feste Aufgabenverteilung besteht zunächst nicht. Die Gesellschafter teilen die Aufgaben nach Absprache und nach ihren Fähigkeiten untereinander auf, zum Beispiel Programmierung, Webdesign, Kundengewinnung, Verkauf, Kundenbetreuung, Herstellung und Bereitstellung der Google Review Cards, Versand sowie Verwaltung."),
  N(2, "Die Aufgabenverteilung kann jederzeit einvernehmlich geändert werden."),
  N(3, "Die Übernahme einer Aufgabe führt weder zu einem höheren Gewinnanteil noch zu mehr Stimmgewicht oder weitergehenden Entscheidungsrechten."),
);

// § 9
children.push(H("§ 9 Ausgaben, Anschaffungen und nicht abgesprochene Käufe"));
children.push(
  N(1, "Eine feste Betragsgrenze für Ausgaben ist bewusst nicht vereinbart. Ausgaben des laufenden Betriebs, die für die übernommenen Aufgaben erforderlich sind (z. B. Domains, Hosting, laufende Software-Abos, Material für Review Cards, Versandkosten), kann jeder Gesellschafter für die Gesellschaft tätigen."),
  N(2, "Größere oder für die Gesellschaft bedeutsame Ausgaben sind vorher gemeinsam abzustimmen. Bedeutsam ist eine Ausgabe insbesondere dann, wenn sie im Verhältnis zu den vorhandenen Mitteln der Gesellschaft erheblich ins Gewicht fällt, eine längere Bindung begründet oder außerhalb des bisherigen Geschäftsbetriebs liegt. Im Zweifel fragt der Gesellschafter vorher nach."),
  N(3, "Tätigt ein Gesellschafter eine Ausgabe für die Gesellschaft, **obwohl er weiß, dass die anderen Gesellschafter diese ausdrücklich nicht wollen** oder obwohl über sie noch keine erforderliche gemeinsame Entscheidung getroffen wurde, gilt im Innenverhältnis:"),
  L("a", "Er hat keinen Anspruch auf Erstattung der Aufwendungen und trägt den entstandenen Aufwand selbst; die Ausgabe wird im Innenverhältnis nicht als Aufwand der Gesellschaft behandelt."),
  L("b", "Wird die Gesellschaft gegenüber dem Vertragspartner gleichwohl verpflichtet, stellt er die Gesellschaft und die übrigen Gesellschafter im Innenverhältnis von dieser Verpflichtung frei und ersetzt einen dadurch entstandenen Schaden."),
  L("c", "Der Gegenstand oder das Recht, das er dabei erworben hat, steht ihm persönlich zu, sofern die übrigen Gesellschafter nicht die Übernahme durch die Gesellschaft beschließen."),
  N(4, "Absatz 3 gilt nicht bei einem bloßen Versehen, bei Eilmaßnahmen zur Abwendung eines drohenden Schadens für die Gesellschaft und bei Ausgaben, die die übrigen Gesellschafter nachträglich genehmigen. Bei einem Versehen ist die Ausgabe wie eine normale Ausgabe der Gesellschaft zu behandeln, sofern sie der Sache nach im Interesse der Gesellschaft lag."),
  N(5, "Verstößt ein Gesellschafter wiederholt und absichtlich gegen diese Regelung, können die übrigen Gesellschafter gemeinsam angemessene Maßnahmen beschließen, insbesondere den Entzug einzelner Aufgaben oder Vertretungsbefugnisse. Ein Ausschluss ist nur unter den Voraussetzungen des § 14 möglich."),
  N(6, "Eine Vertragsstrafe ist nicht vereinbart."),
);

// § 10
children.push(H("§ 10 Trennung von Gesellschafts- und Privatvermögen"));
children.push(
  N(1, "Jeder Gesellschafter darf sein privates Geld selbstverständlich frei verwenden. Private Ausgaben gehen die Gesellschaft nichts an."),
  N(2, "Für die Gesellschaft wird ein eigenes Geschäftskonto geführt. Zahlungen der Gesellschaft laufen grundsätzlich über dieses Konto."),
  N(3, "Legt ein Gesellschafter für die Gesellschaft privat Geld aus, teilt er dies den anderen mit und weist die Ausgabe nach (z. B. Rechnung, Beleg, Screenshot). Erstattet wird nur, was nach § 9 zulässig ausgegeben wurde."),
  N(4, "Über Einnahmen und Ausgaben werden fortlaufend einfache, nachvollziehbare Aufzeichnungen geführt; Belege werden gesammelt und aufbewahrt. Alle Gesellschafter haben jederzeit Zugriff darauf."),
);

// § 11
children.push(H("§ 11 Gewinn und Verlust"));
children.push(
  N(1, "Am Gewinn und am Verlust der Gesellschaft sind die Gesellschafter zu gleichen Teilen beteiligt: Fernando Hener **1/3**, Romeo Reich **1/3**, Diel Bislimi **1/3**."),
  N(2, "Diese Verteilung gilt unabhängig davon, wie viel Zeit oder Arbeit ein Gesellschafter tatsächlich einbringt und aus welchem Geschäftsbereich der Gewinn stammt. Eine abweichende Verteilung – auch einmalig für ein einzelnes Geschäftsjahr oder ein einzelnes Projekt – ist nur wirksam, wenn alle Gesellschafter ihr ausdrücklich und in Textform zustimmen."),
  N(3, "Der Gewinn wird nach Ablauf des Geschäftsjahres ermittelt. Über die Verwendung (Ausschüttung oder Verbleib in der Gesellschaft) entscheiden die Gesellschafter gemeinsam. Die Gesellschafter sind sich einig, dass zunächst ein angemessener Teil des Gewinns in der Gesellschaft verbleiben soll."),
  N(4, "Entnahmen sind nur zulässig, soweit sie gemeinsam beschlossen wurden. Beschlossene Entnahmen erfolgen für alle Gesellschafter gleichmäßig."),
  N(5, "Die Gesellschafter wissen, dass die Gesellschaft selbst keine Einkommensteuer zahlt und jeder Gesellschafter seinen Gewinnanteil persönlich versteuert. Steuerzahlungen sind Privatsache des einzelnen Gesellschafters."),
);

// § 12
children.push(H("§ 12 Kunden, Produkte und Rechte der Gesellschaft"));
children.push(
  N(1, "Kunden, die über Bisnero gewonnen oder betreut werden, sind Kunden der Gesellschaft und nicht Kunden eines einzelnen Gesellschafters – unabhängig davon, wer den Kontakt hergestellt hat."),
  N(2, "Alles, was im Rahmen der Tätigkeit für Bisnero entsteht oder für Bisnero angeschafft wird, steht der Gesellschaft zu. Dazu gehören insbesondere Websites und Website-Vorlagen, Google Review Cards und deren Gestaltungen, sonstige gemeinsam entwickelte digitale Produkte, Angebote, Texte, Designs, Marken- und Namensrechte an „Bisnero“, Domains, Kundendaten und Zugänge. Soweit rechtlich möglich, überträgt jeder Gesellschafter der Gesellschaft die hieran entstehenden Nutzungs- und Verwertungsrechte; im Übrigen räumt er ihr ein unbefristetes, umfassendes und übertragbares Nutzungsrecht ein."),
  N(3, "Kein Gesellschafter nimmt Geschäfte, die zum Geschäftsbereich von Bisnero gehören, ohne Absprache auf eigene Rechnung wahr oder leitet Kunden der Gesellschaft an sich oder an Dritte um. Eine Tätigkeit außerhalb von Bisnero – beruflich, in Ausbildung, Studium oder mit eigenen Projekten anderer Art – ist jedem Gesellschafter erlaubt."),
  N(4, "Scheidet ein Gesellschafter aus, verbleiben Kunden, Produkte und Rechte nach den Absätzen 1 und 2 bei der Gesellschaft. Zugangsdaten, Unterlagen und Geschäftsunterlagen sind unverzüglich herauszugeben; private Kopien von Kundendaten sind zu löschen. Ein nachvertragliches Wettbewerbsverbot besteht nicht."),
);

// § 13
children.push(H("§ 13 Kündigung und Austritt eines Gesellschafters"));
children.push(
  N(1, "Jeder Gesellschafter kann seine Mitgliedschaft mit einer Frist von **drei Monaten zum Ende eines Kalendervierteljahres** kündigen. Die Kündigung ist schriftlich oder in Textform gegenüber den anderen Gesellschaftern zu erklären. Das Recht zur Kündigung aus wichtigem Grund bleibt unberührt."),
  N(2, "Die Kündigung führt nicht zur Auflösung der Gesellschaft. Der kündigende Gesellschafter scheidet aus; die Gesellschaft wird von den übrigen Gesellschaftern fortgeführt. Sein Anteil am Gesellschaftsvermögen wächst den verbleibenden Gesellschaftern zu gleichen Teilen an."),
  N(3, "Der ausscheidende Gesellschafter erhält eine Abfindung nach § 15. Ein Anspruch auf Herausgabe einzelner Gegenstände, Kunden, Projekte oder Rechte der Gesellschaft besteht nicht."),
  N(4, "Die verbleibenden Gesellschafter stellen den Ausgeschiedenen im Innenverhältnis von den bis zu seinem Ausscheiden begründeten Verbindlichkeiten der Gesellschaft frei, soweit diese nicht auf einem Verhalten nach § 9 Abs. 3 beruhen. Die gesetzliche Nachhaftung gegenüber Dritten bleibt unberührt."),
  N(5, "Verbleibt nur noch ein Gesellschafter, endet die Gesellschaft; ihr Vermögen geht auf den verbleibenden Gesellschafter über, der die Abfindungen schuldet."),
);

// § 14
children.push(H("§ 14 Ausschluss eines Gesellschafters aus wichtigem Grund"));
children.push(
  N(1, "Liegt in der Person eines Gesellschafters ein wichtiger Grund vor, der den übrigen Gesellschaftern die Fortsetzung mit ihm unzumutbar macht, können die übrigen Gesellschafter seinen Ausschluss einstimmig beschließen. Ein wichtiger Grund ist insbesondere eine schwerwiegende oder wiederholte vorsätzliche Verletzung der Pflichten aus diesem Vertrag."),
  N(2, "Der Ausschluss ist dem betroffenen Gesellschafter schriftlich oder in Textform mitzuteilen und zu begründen; bei behebbaren Pflichtverletzungen ist ihm zuvor Gelegenheit zur Abhilfe zu geben. Er hat bei der Beschlussfassung kein Stimmrecht."),
  N(3, "Im Übrigen gelten §§ 13 und 15 entsprechend."),
);

// § 15
children.push(H("§ 15 Abfindung"));
children.push(
  N(1, "Der ausscheidende Gesellschafter hat Anspruch auf eine Abfindung. Ein automatischer Anspruch auf ein Drittel des Unternehmenswertes besteht nicht."),
  N(2, "Die Höhe der Abfindung bestimmen die verbleibenden Gesellschafter gemeinsam nach **billigem Ermessen** (§ 315 BGB). Sie berücksichtigen dabei insbesondere die tatsächliche Lage der Gesellschaft im Zeitpunkt des Ausscheidens, namentlich: vorhandene liquide Mittel, Waren, Material und Gegenstände, offene Kundenforderungen, Verbindlichkeiten und sonstige Verpflichtungen, laufende Projekte und deren Erfolgsaussichten, die Ertragslage sowie Dauer und Umfang der Mitarbeit des ausscheidenden Gesellschafters."),
  N(3, "Ein Geschäfts- oder Firmenwert (Goodwill), insbesondere ein Wert für Kundenstamm, Marke und Zukunftsaussichten, wird nur in dem Umfang berücksichtigt, den die verbleibenden Gesellschafter nach Absatz 2 für angemessen halten; ein voller Anteil hieran wird nicht geschuldet."),
  N(4, "**Mindestbetrag:** Die Abfindung beträgt mindestens den auf den ausscheidenden Gesellschafter entfallenden Anteil (1/3) am Buchwert des Gesellschaftsvermögens abzüglich der Verbindlichkeiten, mindestens jedoch seine geleisteten und noch nicht zurückgezahlten Einlagen sowie noch nicht ausgezahlte, ihm bereits zugewiesene Gewinnanteile."),
  N(5, "Die Festsetzung nach Absatz 2 ist für den ausscheidenden Gesellschafter nur verbindlich, wenn sie billigem Ermessen entspricht. Ist sie offenbar unbillig oder wird sie nicht innerhalb von drei Monaten nach dem Ausscheiden mitgeteilt, wird sie auf Antrag durch Urteil bestimmt (§ 315 Abs. 3 BGB)."),
  N(6, "Die Abfindung ist in bis zu **drei gleichen Jahresraten** zu zahlen; die erste Rate wird drei Monate nach dem Ausscheiden fällig. Der jeweils offene Betrag ist mit **[ZINSSATZ, z. B. 3] % p. a.** zu verzinsen. Die Gesellschaft kann jederzeit vorzeitig zahlen. Die Ratenzahlung darf den Fortbestand der Gesellschaft nicht gefährden; umgekehrt darf sie den Ausscheidenden nicht unangemessen benachteiligen."),
  N(7, "Übersteigen die Verbindlichkeiten der Gesellschaft ihr Vermögen, entfällt die Abfindung; der ausscheidende Gesellschafter hat den auf ihn entfallenden Fehlbetrag (1/3) auszugleichen."),
  N(8, "Sollte die Abfindung nach den Absätzen 2 bis 4 im Einzelfall in einem groben Missverhältnis zum tatsächlichen Wert des Anteils stehen, ist sie auf einen angemessenen Betrag anzupassen. Die übrigen Regelungen dieses Vertrages bleiben davon unberührt."),
);

// § 16
children.push(H("§ 16 Tod eines Gesellschafters"));
children.push(
  N(1, "Stirbt ein Gesellschafter, wird die Gesellschaft von den übrigen Gesellschaftern fortgeführt. Der verstorbene Gesellschafter scheidet mit dem Todestag aus; sein Anteil wächst den übrigen Gesellschaftern zu gleichen Teilen an. Die Erben werden nicht Gesellschafter."),
  N(2, "Die Erben erhalten gemeinsam die Abfindung nach § 15; mehrere Erben können ihre Rechte nur einheitlich geltend machen und benennen dafür einen gemeinsamen Ansprechpartner."),
  N(3, "Die Erben können auf Wunsch als Gesellschafter aufgenommen werden, wenn alle verbleibenden Gesellschafter zustimmen (§ 17)."),
  N(4, "Stirbt der vorletzte Gesellschafter, gilt § 13 Abs. 5 entsprechend."),
);

// § 17
children.push(H("§ 17 Aufnahme neuer Gesellschafter, Übertragung von Anteilen"));
children.push(
  N(1, "Ein neuer Gesellschafter kann nur aufgenommen werden, wenn **alle** bisherigen Gesellschafter zustimmen. Die Aufnahme wird schriftlich festgehalten; dabei wird auch geregelt, wie sich Stimmrechte und Gewinnverteilung künftig zusammensetzen."),
  N(2, "Die Übertragung, Verpfändung oder sonstige Belastung eines Gesellschaftsanteils – ganz oder teilweise – ist nur mit Zustimmung aller übrigen Gesellschafter zulässig."),
);

// § 18
children.push(H("§ 18 Auflösung und Auseinandersetzung"));
children.push(
  N(1, "Die Gesellschaft wird aufgelöst, wenn alle Gesellschafter dies gemeinsam beschließen, oder in den gesetzlich vorgesehenen Fällen."),
  N(2, "Nach der Auflösung werden zunächst die laufenden Geschäfte beendet und offene Angelegenheiten abgewickelt, anschließend die Verbindlichkeiten und sonstigen Verpflichtungen der Gesellschaft beglichen und geleistete Einlagen zurückgezahlt, soweit das Vermögen dafür ausreicht."),
  N(3, "Das danach verbleibende Vermögen wird zu gleichen Teilen verteilt: je **1/3** an Fernando Hener, Romeo Reich und Diel Bislimi, soweit sie zu diesem Zeitpunkt noch Gesellschafter sind. Für vorher ausgeschiedene Gesellschafter gilt ausschließlich § 15."),
  N(4, "Reicht das Vermögen zur Deckung der Verbindlichkeiten nicht aus, tragen die Gesellschafter den Fehlbetrag zu gleichen Teilen (je 1/3)."),
  N(5, "Die Abwicklung nehmen die Gesellschafter gemeinsam vor. Gegenstände der Gesellschaft können einzelnen Gesellschaftern gegen Anrechnung auf ihren Anteil übertragen werden, wenn alle zustimmen."),
);

// § 19
children.push(H("§ 19 Änderungen dieses Vertrages"));
children.push(
  N(1, "Änderungen und Ergänzungen dieses Vertrages bedürfen der Zustimmung aller Gesellschafter und der Schriftform. Das gilt auch für die Aufhebung dieser Schriftformklausel."),
  N(2, "Mündliche Nebenabreden zu den Regelungen dieses Vertrages bestehen nicht."),
);

// § 20
children.push(H("§ 20 Schlussbestimmungen"));
children.push(
  N(1, "Es gilt deutsches Recht. Soweit dieser Vertrag nichts anderes regelt, gelten die gesetzlichen Vorschriften über die Gesellschaft bürgerlichen Rechts (§§ 705 ff. BGB)."),
  N(2, "Sollte eine Bestimmung dieses Vertrages unwirksam oder undurchführbar sein oder werden, bleibt der Vertrag im Übrigen wirksam. Die Gesellschafter verpflichten sich, die unwirksame Bestimmung durch eine wirksame Regelung zu ersetzen, die dem wirtschaftlich Gewollten am nächsten kommt. Entsprechendes gilt für Regelungslücken."),
  N(3, "Die Gesellschafter werden Streitigkeiten aus diesem Vertrag zunächst persönlich und in gutem Willen zu klären versuchen, bevor sie gerichtliche Schritte einleiten."),
  N(4, "Gerichtsstand ist, soweit zulässig, der Sitz der Gesellschaft."),
);

// Signatures
children.push(HR());
children.push(H1("Unterschriften"));
children.push(P("Ort, Datum:  ______________________________", { after: 400 }));

const SIGLINE = "__________________________________________";
["Fernando Hener", "Romeo Reich", "Diel Bislimi"].forEach((name) => {
  children.push(
    new Paragraph({ children: [new TextRun({ text: SIGLINE })], spacing: { before: 320, after: 40 } }),
    new Paragraph({
      children: [new TextRun({ text: name, bold: true, size: 20 })],
      spacing: { after: 240 },
    }),
  );
});

// --- Anhang 1: Checkliste ---
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(H1("Vor der Unterschrift noch prüfen"));

const checklist = [
  "**Fehlende Angaben ergänzen:** Sitz und Geschäftsanschrift der Gesellschaft (§ 1), Geburtsdaten (§ 2), Bareinlagen (§ 5), Zinssatz für Abfindungsraten (§ 15 Abs. 6).",
  "**Abfindungsregelung (§ 15) anwaltlich prüfen lassen.** Das ist der rechtlich heikelste Punkt des Vertrages – siehe die Erläuterung im Anhang.",
  "**Gewerbeanmeldung:** Termin am 24.08.2026, 11:00 Uhr. Alle drei Gesellschafter müssen ein Gewerbe anmelden (jeder für sich als Gesellschafter der GbR). Personalausweis mitnehmen. Danach folgt der steuerliche Erfassungsbogen des Finanzamts (Steuernummer, ggf. Umsatzsteuer-ID).",
  "**Kleinunternehmerregelung (§ 19 UStG)** klären: mit oder ohne Umsatzsteuer starten? Das solltet ihr mit einem Steuerberater entscheiden, bevor ihr die ersten Rechnungen schreibt.",
  "**Geschäftskonto** eröffnen, auf das alle drei Zugriff haben (§ 10).",
  "**Persönliche Haftung:** Bei einer GbR haftet jeder von euch mit dem Privatvermögen für alle Schulden der Gesellschaft – auch für das, was ein anderer verursacht. Prüft eine Betriebshaftpflichtversicherung und überlegt, ab welcher Größe ein Wechsel zur UG/GmbH sinnvoll wird.",
  "**Eintragung ins Gesellschaftsregister (eGbR)** – nicht zwingend, aber Voraussetzung für bestimmte Geschäfte und für viele Banken und Partner praktisch. Kurz mit dem Anwalt besprechen (§ 1 Abs. 4).",
  "**Google Review Cards:** Rechtliche Rahmenbedingungen des Produkts prüfen (Google-Richtlinien zu Bewertungen, insbesondere das Verbot von Anreizen für Bewertungen und von gefilterten „nur positive Bewertungen“-Funnels; UWG). Das betrifft nicht diesen Vertrag, aber euer Geschäftsmodell.",
  "**Datenschutz nach außen:** Für Kundenwebsites und Kundendaten braucht ihr ggf. Auftragsverarbeitungsverträge mit euren Kunden. Untereinander habt ihr bewusst keine Datenschutzregelung – das ist in Ordnung.",
  "**Vertrag dreifach ausdrucken und unterschreiben** – jeder Gesellschafter behält ein Original.",
];
checklist.forEach((t, i) => children.push(N(i + 1, t)));

// --- Anhang 2: rechtliche Hinweise ---
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(H1("Hinweise zu Punkten, die rechtlich problematisch sind"));
children.push(
  P("Diese Punkte wurden nicht stillschweigend geändert, sondern so nah wie möglich am Wunsch der Gesellschafter formuliert und hier offengelegt.", { after: 200 }),
);

children.push(H("1. Abfindung durch die verbleibenden Gesellschafter (§ 15)"));
children.push(
  P("**Der Wunsch:** Die zwei verbleibenden Gesellschafter bestimmen die faire Abfindung, kein automatisches Drittel."),
  P("**Das Problem:** Eine Klausel, nach der die verbleibenden Gesellschafter die Abfindung völlig frei und unüberprüfbar festlegen, wäre nach deutscher Rechtsprechung mit hoher Wahrscheinlichkeit unwirksam. Ein vollständiger Ausschluss der Abfindung ist – von Sonderfällen abgesehen – sittenwidrig (§ 138 BGB), und eine einseitige Festsetzung ohne jede Grenze hält der gerichtlichen Kontrolle nicht stand. Wäre die Klausel unwirksam, würde die gesetzliche Regelung greifen – und die läuft im Ergebnis genau auf das hinaus, was vermieden werden soll: den vollen anteiligen Wert (§ 728 BGB)."),
  P("**Die Lösung im Entwurf:** Die verbleibenden Gesellschafter setzen die Abfindung fest, aber „nach billigem Ermessen“ (§ 315 BGB) und anhand der genannten Kriterien. Der Goodwill – meist der größte Teil des „Unternehmenswertes“ – wird ausdrücklich nur eingeschränkt berücksichtigt. Ein niedriger Mindestbetrag (Anteil am Substanzwert, Einlagen, offene Gewinnanteile) und die gerichtliche Überprüfbarkeit machen die Klausel haltbar. Praktisch bleibt das sehr nah am Wunsch: kein automatisches Drittel des Unternehmenswertes, aber auch keine Klausel, die vor Gericht kippt."),
);

children.push(H("2. Nicht abgesprochene Käufe (§ 9)"));
children.push(
  P("Im Innenverhältnis funktioniert die gewünschte Regelung – der Gesellschafter bleibt auf der Ausgabe sitzen und muss die anderen freistellen. Nach außen gilt sie jedoch nicht: Hat der Gesellschafter Vertretungsmacht, ist die Gesellschaft gegenüber dem Verkäufer trotzdem gebunden, und alle drei haften dem Verkäufer gegenüber persönlich. Der Ausgleich findet also immer erst intern statt. Eine bewusste Ausnahme für Versehen und Eilfälle ist eingebaut, damit niemand für einen normalen Fehler unverhältnismäßig belastet wird. Auf eine Vertragsstrafe wurde verzichtet – sie wäre bei dieser Konstellation streitanfällig und hier unnötig."),
);

children.push(H("3. Kein Deadlock-Mechanismus (§ 6 Abs. 4)"));
children.push(
  P("Wie gewünscht gibt es keinen Stichentscheid und kein Schiedsverfahren: Bei Uneinigkeit passiert nichts. Das ist zulässig und für drei gleichberechtigte Freunde nachvollziehbar. Das Risiko sollte bekannt sein: Wenn dauerhaft keine Einigung zustande kommt, kann die Gesellschaft handlungsunfähig werden, und der einzige Ausweg ist dann Kündigung (§ 13) oder Auflösung (§ 18). Die einfachste spätere Ergänzung wäre eine Mediationsklausel – nicht ein Sonderstimmrecht für einen der Gesellschafter."),
);

children.push(H("4. Verlustbeteiligung (§ 11)"));
children.push(
  P("Die 1/3-Verteilung von Gewinn und Verlust gilt im Innenverhältnis. Gegenüber Gläubigern haftet jeder Gesellschafter für den vollen Betrag; wer mehr zahlt, holt sich intern die Anteile der anderen zurück."),
);

// ---------- document ----------

const doc = new Document({
  creator: "Bisnero GbR",
  title: "Gesellschaftsvertrag der Bisnero GbR (Entwurf)",
  description: "Vertragsentwurf",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: "1A1A1A" },
        paragraph: { spacing: { line: 276, after: 120 } },
      },
      heading1: {
        run: { font: "Calibri", size: 30, bold: true, color: "1A1A1A" },
        paragraph: { spacing: { before: 360, after: 180 } },
      },
      heading2: {
        run: { font: "Calibri", size: 24, bold: true, color: "1A1A1A" },
        paragraph: { spacing: { before: 320, after: 140 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Gesellschaftsvertrag Bisnero GbR – Entwurf – Seite ", size: 16, color: "808080" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "808080" }),
                new TextRun({ text: " von ", size: 16, color: "808080" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "808080" }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log("written:", process.argv[2], buf.length, "bytes");
});
