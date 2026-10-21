title: Voice direction demo
channel: poisonpill
look: noir
voice: am_michael*.7+bm_george*.3
delivery: wry
voices: founder=bm_lewis
music: auto
// v6 voice direction (references/voice-direction.md): the same narrator reads the rise quicker and brighter, the fall
// slower and lower; reveals get a silence before them; a real quote is read by a cast voice and tagged on screen.
// Run: node tools/make.mjs stories/voice_demo.story --fmt 16x9 --jobs 2

# cine act=rise fx="build:x;el:N=num:1750000000:$,.5,.45,.2;do:N.count@raised"
They raised one point seven five **billion** dollars. It was the biggest seed round anyone had ever seen.

# cine act=doubt fx="quote:We will be profitable next year.;by:The founder, 2019 letter to investors"
In his words: [BEAT]
@founder: We will be profitable next year. {archive}

# cine act=fall fx="build:x;el:N=num:0:$,.5,.45,.2;do:N.red@gone"
Six months later? {hit} **Gone.**
