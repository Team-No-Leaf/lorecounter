from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from check_assets import check_assets


class BuildAssetTests(unittest.TestCase):
    def setUp(self):
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'assets').mkdir()
        (self.root / 'assets/app.js').write_text('export {};')
        (self.root / 'assets/app.css').write_text('body { color: black; }')

    def entry(self, script='./assets/app.js', style='./assets/app.css', root=True):
        (self.root / 'index.html').write_text(
            f'<script type="module" src="{script}"></script>'
            f'<link rel="stylesheet" href="{style}">'
            + ('<div id="root"></div>' if root else ''), encoding='utf-8')

    def test_valid_subdirectory_build(self):
        self.entry()
        self.assertEqual(check_assets(self.root), 2)

    def test_original_white_page_regression(self):
        self.entry(script='/assets/app.js')
        with self.assertRaisesRegex(ValueError, 'must use ./assets/'):
            check_assets(self.root)

    def test_root_stylesheet(self):
        self.entry(style='/assets/app.css')
        with self.assertRaises(ValueError):
            check_assets(self.root)

    def test_missing_bundle(self):
        self.entry(script='./assets/missing.js')
        with self.assertRaisesRegex(ValueError, 'Missing or empty'):
            check_assets(self.root)

    def test_external_bundle(self):
        self.entry(script='https://example.com/app.js')
        with self.assertRaises(ValueError):
            check_assets(self.root)

    def test_encoded_traversal(self):
        self.entry(script='./assets/%2e%2e/app.js')
        with self.assertRaisesRegex(ValueError, 'escapes'):
            check_assets(self.root)

    def test_empty_bundle(self):
        self.entry()
        (self.root / 'assets/app.js').write_text('')
        with self.assertRaisesRegex(ValueError, 'Missing or empty'):
            check_assets(self.root)

    def test_missing_root(self):
        self.entry(root=False)
        with self.assertRaisesRegex(ValueError, 'application root'):
            check_assets(self.root)


if __name__ == '__main__':
    unittest.main()
