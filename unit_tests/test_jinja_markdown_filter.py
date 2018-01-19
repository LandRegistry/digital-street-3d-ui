from flask_skeleton_ui.main import app
from flask import render_template_string


class TestJinjaMarkdownFilter(object):

    def setup_method(self, method):
        self.app = app.test_client()

    def check_rendering(self, markdown_to_html):
        for markdown in markdown_to_html:
            with app.test_request_context('/'):
                assert render_template_string('{{contents|markdown}}',
                                              contents=markdown).strip() == markdown_to_html.get(markdown)

    def test_render_returns_govuk_html_for_headings(self):
        markdown_to_html = {
            '# 1': '<h1 class="heading-xlarge">1</h1>',
            '## 2': '<h2 class="heading-large">2</h2>',
            '### 3': '<h3 class="heading-medium">3</h3>',
            '#### 4': '<h4 class="heading-small">4</h4>',
            '##### 5': '<h5 class="heading-small">5</h5>',
            '###### 6': '<h6 class="heading-small">6</h6>'
        }

        self.check_rendering(markdown_to_html)

    def test_render_returns_govuk_html_for_lists(self):
        markdown_to_html = {
            '- Foo\n- Bar\n- Wibble': '<ul class="list list-bullet"><li>Foo</li>\n<li>Bar</li>\n<li>Wibble</li>\n</ul>',
            '1. Foo\n2. Bar\n3. Wibble': '<ol class="list list-number">'
                                         '<li>Foo</li>\n<li>Bar</li>\n<li>Wibble</li>\n</ol>'
        }

        self.check_rendering(markdown_to_html)

    def test_render_returns_govuk_html_for_double_emphasis(self):
        markdown_to_html = {
            '**Foo**': '<p><strong class="bold">Foo</strong></p>',
            '**Foo** **bar**': '<p><strong class="bold">Foo</strong> <strong class="bold">bar</strong></p>'
        }

        self.check_rendering(markdown_to_html)
