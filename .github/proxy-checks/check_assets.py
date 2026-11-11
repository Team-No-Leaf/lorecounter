"""Reject proxy builds that cannot be hosted below the site's root."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys


class EntryAssets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []
        self.has_root = False

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'div' and attrs.get('id') == 'root':
            self.has_root = True
        if tag == 'script' and attrs.get('type') == 'module':
            self.assets.append(('module', attrs.get('src', '')))
        if tag == 'link' and 'stylesheet' in attrs.get('rel', '').split():
            self.assets.append(('stylesheet', attrs.get('href', '')))


def check_assets(directory):
    root = Path(directory).resolve()
    parser = EntryAssets()
    parser.feed((root / 'index.html').read_text(encoding='utf-8'))
    if not parser.has_root:
        raise ValueError('Proxy entry page is missing its application root.')
    for kind in ('module', 'stylesheet'):
        if not any(item[0] == kind for item in parser.assets):
            raise ValueError(f'Proxy entry page is missing its {kind}.')
    for kind, reference in parser.assets:
        url = urlsplit(reference)
        if url.scheme or url.netloc or not reference.startswith('./assets/'):
            raise ValueError(f'{kind} must use ./assets/, not {reference!r}. Build with base: "./".')
        target = (root / unquote(url.path)).resolve()
        if not target.is_relative_to(root / 'assets'):
            raise ValueError(f'Asset escapes the build directory: {reference}')
        if not target.is_file() or target.stat().st_size == 0:
            raise ValueError(f'Missing or empty asset: {reference}')
        expected = '.js' if kind == 'module' else '.css'
        if target.suffix != expected:
            raise ValueError(f'Unexpected {kind} format: {reference}')
    return len(parser.assets)


if __name__ == '__main__':
    try:
        count = check_assets(sys.argv[1])
        print(f'Passed: {count} proxy entry assets use portable paths and exist on disk.')
    except (ValueError, OSError, IndexError) as error:
        sys.exit(f'PROXY DEPLOYMENT BLOCKED: {error}')
