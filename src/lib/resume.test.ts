import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildCareerEvents,
  calculateAge,
  parseYearMonth,
  sortEvents,
} from './resume.ts'
import type { Company } from '../types'

/** 職歴生成の検証に必要な最小限の会社データを作る。 */
function company(name: string, start: string, end: string | null): Company {
  return {
    name,
    order: 1,
    url: '',
    period: '',
    roles: [],
    employment: { start, end },
  }
}

test('入退社とフリーランス開始を統合し、在職中の退社は生成しない', () => {
  const actual = buildCareerEvents(
    [company('現職', '2025-06', null), company('前職', '2023-08', '2025-01')],
    [{ date: '2025-02', text: 'フリーランスとして活動開始' }],
  )
  assert.deepEqual(actual, [
    { date: '2023-08', text: '前職 入社' },
    { date: '2025-01', text: '前職 退社' },
    { date: '2025-02', text: 'フリーランスとして活動開始' },
    { date: '2025-06', text: '現職 入社' },
  ])
})

test('年月未入力の会社について推測で入退社を生成しない', () => {
  const incomplete = company('未入力', '2025-01', null)
  delete incomplete.employment
  assert.deepEqual(buildCareerEvents([incomplete], []), [])
})

test('不正な年月と逆転した在籍期間を拒否する', () => {
  for (const value of ['2025-00', '2025-13', '2025-1', '現在', '']) {
    assert.throws(() => parseYearMonth(value))
  }
  assert.throws(() =>
    buildCareerEvents([company('会社', '2025-06', '2025-01')], []),
  )
  assert.throws(() =>
    buildCareerEvents([], [{ date: '2025-13', text: '出来事' }]),
  )
})

test('同年月の学歴は入力順を維持し、元データを変更しない', () => {
  const events = [
    { date: '2020-03', text: '卒業' },
    { date: '2016-04', text: '入学' },
    { date: '2020-03', text: '修了' },
  ]
  const original = structuredClone(events)
  assert.deepEqual(
    sortEvents(events).map((event) => event.text),
    ['入学', '卒業', '修了'],
  )
  assert.deepEqual(events, original)
})

test('資格は年月不明を末尾に表示し、学歴・職歴の空欄は拒否する', () => {
  const events = [
    { date: '', text: '免許' },
    { date: '2020-04', text: '資格' },
    { date: '', text: '別の資格' },
  ]
  const original = structuredClone(events)
  assert.deepEqual(sortEvents(events, true), [events[1], events[0], events[2]])
  assert.deepEqual(events, original)
  assert.throws(() => sortEvents(events))
  assert.throws(() => sortEvents([{ date: '2020-13', text: '資格' }], true))
})

test('満年齢は作成基準日で計算し、誕生日の前後を区別する', () => {
  assert.equal(calculateAge('1981年7月21日', '2026年11月3日現在'), 45)
  assert.equal(calculateAge('1981年7月21日', '2026年7月20日現在'), 44)
  assert.equal(calculateAge('1981年7月21日', '2026年7月21日現在'), 45)
  assert.equal(calculateAge('1981年7月21日', '2027年1月1日現在'), 45)
  assert.equal(calculateAge('1981年7月21日', '1981年7月21日現在'), 0)
})

test('日付が未入力・不正・出生前の場合は年齢を表示しない', () => {
  assert.equal(calculateAge('', '2026年11月3日現在'), null)
  assert.equal(calculateAge('1981年7月21日', ''), null)
  assert.equal(calculateAge('1981年2月29日', '2026年11月3日現在'), null)
  assert.equal(calculateAge('1981年7月21日', '2026年13月1日現在'), null)
  assert.equal(calculateAge('1981年7月21日', '1981年7月20日現在'), null)
})
