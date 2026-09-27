import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { getOverallProgress, getSectionProgress, syllabus, totalTopicCount } from './syllabus.js';

test('catalog contains the exact ten sections and approved per-section topic counts', () => {
  assert.deepEqual(
    syllabus.map(({ name, topics }) => [name, topics.length]),
    [
      ['Engineering Mathematics', 26],
      ['Digital Logic', 9],
      ['Computer Organization and Architecture', 13],
      ['Programming and Data Structures', 10],
      ['Algorithms', 11],
      ['Theory of Computation', 9],
      ['Compiler Design', 10],
      ['Operating System', 12],
      ['Databases', 12],
      ['Computer Networks', 22],
    ]
  );
  assert.equal(totalTopicCount, 134);
});

test('catalog topic IDs are unique and its ordered topic text matches the approved source', () => {
  const allTopics = syllabus.flatMap((section) => section.topics);
  assert.equal(new Set(allTopics.map(({ id }) => id)).size, totalTopicCount);
  const sourceSignature = syllabus
    .flatMap((section) => [section.name, ...section.topics.map(({ name }) => name)])
    .join('\n');
  assert.equal(
    createHash('sha256').update(sourceSignature).digest('hex'),
    'beaa1b44c49cda3f88697d0e4f5934d41655a3fc38e11d44916f9d8224167dfb'
  );
});

test('section and cumulative progress are derived from completed catalog topic IDs', () => {
  const digitalLogic = syllabus.find(({ name }) => name === 'Digital Logic');
  const completed = new Set(digitalLogic.topics.slice(0, 3).map(({ id }) => id));
  const sectionProgress = getSectionProgress(digitalLogic, completed);
  const overallProgress = getOverallProgress(completed);

  assert.equal(sectionProgress.completedCount, 3);
  assert.equal(sectionProgress.totalCount, 9);
  assert.equal(sectionProgress.percentage, (3 / 9) * 100);
  assert.equal(overallProgress.completedCount, 3);
  assert.equal(overallProgress.totalCount, 134);
  assert.equal(overallProgress.percentage, (3 / 134) * 100);
  assert.equal(getOverallProgress(new Set()).percentage, 0);
});
