import test from 'ava'
import renderer from '../../src/libs/md-renderer'
import marked from 'marked'
import { classes } from '../../src/defaults/config.json'

test('should render paragraphs', t => {
  t.is(marked('foo bar', { renderer }), `<p class="${classes.p}">foo bar</p>`)
})

test('should render blockquote', t => {
  t.is(marked('> foo bar', { renderer }), `<blockquote class="${classes.blockquote}"><p >foo bar</p></blockquote>`)
})

test('should render headings', t => {
  t.is(marked('# foo bar', { renderer }), `<h1 class="${classes.h1}" id="foo-bar">foo bar</h1>`)
  t.is(marked('# foo bar', { renderer }), marked('foo bar\n=======', { renderer }))
  t.is(marked('## foo bar', { renderer }), `<h2 class="${classes.h2}" id="foo-bar">foo bar</h2>`)
  t.is(marked('### foo bar', { renderer }), `<h3 class="${classes.h3}" id="foo-bar">foo bar</h3>`)
  t.is(marked('#### foo bar', { renderer }), `<h4 class="${classes.h4}" id="foo-bar">foo bar</h4>`)
  t.is(marked('##### foo bar', { renderer }), `<h5 class="${classes.h5}" id="foo-bar">foo bar</h5>`)
  t.is(marked('###### foo bar', { renderer }), `<h6 class="${classes.h6}" id="foo-bar">foo bar</h6>`)
})

test('should render code', t => {
  t.is(marked('```\nfoo bar\n```', { renderer }), `<pre class="${classes.code}"><code>foo bar</code></pre>`)
})

test('should render hr', t => {
  t.is(marked('---', { renderer }), `<hr class="${classes.hr}">`)
})

test('should render ordered list', t => {
  t.is(marked('1. foo\n2. bar', { renderer }), `<ol class="${classes.ol}"><li>foo</li>\n<li>bar</li>\n</ol>`)
})

test('should render unordered list', t => {
  t.is(marked('- foo\n- bar', { renderer }), `<ul class="${classes.ul}"><li>foo</li>\n<li>bar</li>\n</ul>`)
})

test('should render strong span', t => {
  t.is(marked('**foo** bar', { renderer }), `<p class="${classes.p}"><strong class="${classes.strong}">foo</strong> bar</p>`)
})

test('should render codespan', t => {
  t.is(marked('`foo` bar', { renderer }), `<p class="${classes.p}"><code class="${classes.codespan}">foo</code> bar</p>`)
})

test('should render link', t => {
  t.is(marked('[foo](bar)', { renderer }), `<p class="${classes.p}"><a href="bar" class="${classes.link}">foo</a></p>`)
})
