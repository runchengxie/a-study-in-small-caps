import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const research = JSON.parse(fs.readFileSync(new URL('../src/data/research.json', import.meta.url), 'utf8'));
test('full-text claims identify the edition actually reviewed and its exact source bytes', () => {
  const reviewed = research.literature.filter(paper => paper.stage === 'fulltext');
  assert.ok(reviewed.length >= 3, 'At least three primary texts should actually be read in this expansion');
  for (const paper of reviewed) {
    const reading = paper.fulltext;
    assert.ok(reading, `${paper.id}: missing reading record`);
    assert.match(reading.sha256, /^[a-f0-9]{64}$/);
    assert.match(reading.pdfUrl, /^https:\/\//);
    assert.match(reading.reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(reading.edition.length > 10);
    assert.ok(reading.sections.length > 0 && reading.limitations.length > 0);
    for (const section of reading.sections) {
      assert.ok(section.title.en && section.title.zh);
      for (const paragraph of section.paragraphs) assert.ok(paragraph.en && paragraph.zh);
    }
    assert.match(JSON.stringify(reading.sections), /(?:pp?\.|pages?|Table|Section|表|页)/i, `${paper.id}: reading must identify textual locations`);
  }
});
