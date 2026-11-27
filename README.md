# TreeToken Optimizer Claude

`treeyagi-band` puts Treeyagi in place of Clawd in the Token Optimizer status band in the Claude desktop app. Token Optimizer still decides what he is doing; this mod only swaps the picture, so Token Optimizer updates don't undo it.

## Install

Needs the [Token Optimizer](https://github.com/alexgreensh/token-optimizer) plugin and the Claude desktop app. Then, at the prompt of a Claude Code session:

```
/plugin install treeyagi-band --marketplace Treeyagi/TreeToken-Optimizer-Claude
```

Answer `y` to add the marketplace, then pick a scope. Restart the session and Treeyagi appears in the Token Optimizer band.

| Clawd pose | Treeyagi action |
| --- | --- |
| watching | idle |
| waking up | stretch |
| thinking | think |
| reading | clearance_inspect |
| typing | window_sit, with a laptop on his lap |
| heavy lifting (subagents) | bee_carry |
| needs you / pointer on the band | wave |
| writing | talk |
| compacting | meditate |
| done | victory |
| stopped | shrug |
| dizzy (error) | faint |
| cold cache | sulk |
| napping | nap |

To change a mapping, edit `POSES` in `tools/build-sprites.py` and rebuild:

    python3 -I tools/build-sprites.py /path/to/Treeyagi-Complete-Pack/Game-Character

Every pose must stay under the band's 131,072-character picture limit; the script prints each pose's size.

## Credits

Built on [Token Optimizer](https://github.com/alexgreensh/token-optimizer) by [Alex Greenshpun](https://github.com/alexgreensh). Its desktop status band, Clawd's poses and the logic that decides which pose to show are all Token Optimizer's; this mod only swaps the picture it draws. Token Optimizer is licensed separately under its own terms, and none of its code is copied here.

Treeyagi character art by Treeyagi. See LICENSE: the code is MIT, the character art is all rights reserved.
