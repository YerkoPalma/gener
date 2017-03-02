import test from 'ava'
import { formatDate } from '../../src/libs/helpers'

test('should throw if the argument is not an object', t => {
  t.throws(() => { formatDate() }, Error)
  t.throws(() => { formatDate('02/02/2017') }, Error)
  t.throws(() => { formatDate(new Date()) }, Error)
})

test('argument should have day, month and year property as numbers', t => {
  t.throws(() => { formatDate({ year: 1990 }) }, Error)
  t.throws(() => { formatDate({ day: 1, month: 12 }) }, Error)
  t.throws(() => { formatDate({ day: 1, month: '12', year: 2015 }) }, Error)
})

test('should parse date', t => {
  t.is(formatDate({
    day: 1,
    month: 2,
    year: 2017
  }), '1 February, 2017')
})
