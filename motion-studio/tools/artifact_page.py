"""Turn pub/player.html into the artifact page (downloads capability instead of <a download>): python3 tools/artifact_page.py"""
s = open('pub/player.html').read()
def R(a, b):
    global s
    assert a in s, a[:60]; s = s.replace(a, b, 1)
s = s[s.index('\n') + 1:]
R('</style></head><body>', '</style>')
R('<label>Export</label><button id="export">', '<label>Export</label><p class="time" id="dlnote" style="margin:0">Saving asks for confirmation in the viewer.</p><button id="export">')
R("a.href = c.toDataURL('image/png'); a.click();", "c.toBlob(b => saveFile(a.download, b), 'image/png');")
R("a.href = URL.createObjectURL(blob); a.click();", "saveFile(a.download, blob);")
R("</script></body></html>", """
let DL = null; (async () => { try { DL = await (window.claude && claude.use ? claude.use('downloads') : null); } catch (e) {} if (!DL) document.getElementById('dlnote').textContent = 'Saving is unavailable in this view — use player.html from the package.'; })();
async function saveFile(name, blob) { if (!DL) { document.getElementById('dlnote').textContent = 'Saving unavailable here — use player.html from the package.'; return; }
  try { await DL.save({ filename: name, data: blob }); } catch (e) { document.getElementById('dlnote').textContent = 'Not saved (' + (e.code || e.message || e) + ').'; } }
</script>""")
open('out/player_artifact.html', 'w').write(s); print('out/player_artifact.html', len(s))
