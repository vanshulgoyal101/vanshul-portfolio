---
title: "Agents Write Faster Than I Can Check"
slug: "agents-write-faster-than-i-can-check"
summary: "I build AdBrain with a team of AI coding agents working in parallel. Writing code stopped being the hard part. Knowing which of it to trust became the job."
date: "11 Nov, 2026"
readTime: "6 min read"
category: "AI"
---

I build my ad product, AdBrain, with a team of AI coding agents. Not one assistant in an editor. About two dozen chats, each with a role: a CEO that plans, a CTO, eight developers, two QA agents, a reviewer, DevOps, a designer, an analyst, a docs writer. They run in VS Code on one Mac, they talk to each other through GitHub issues, and they ship to production many times a day.

I started the simple way. I wrote a detailed spec, handed it to an agent, and checked what came back. That worked. So I added more agents, assuming more workers would mean more product.

It did mean more of something. In one week in October the team merged over a thousand pull requests. Around the same time the product had no outside customer. Most of what I've learned since is about the gap between those two facts.

## Checking became the job

An agent produces confident work much faster than I can verify it. That sounds like a small observation. It changes how the whole team has to run.

With human engineers, writing code is the slow part, so you organize around it. With agents, writing is nearly free. What's slow is deciding whether a change is right. Every pull request needs someone to say "yes, at this exact commit." When I looked at where work was waiting, it wasn't waiting on developers. It was waiting on verdicts. One rebased patch, byte for byte identical to one already approved, sat for two hours waiting for a fresh approval and held up three releases behind it.

So I stopped adding developers. I added a second QA agent and a reviewer, because that's where the queue was. It felt backwards. It was the change that matched the bottleneck.

The same thing happened when I tried to keep everyone busy. I set a rule that every agent should always have at least three items in its queue. The team produced 1,071 contributions in a single day. It was activity, not outcomes. And when their queues ran dry, the agents filled them with plumbing: engineering metrics, flaky-test quarantine, skill programs. An agent with an empty queue will find something to build. I replaced the queue floor with a daily re-rank by customer value, and I learned to accept idle agents. Idle is cheap. Unchecked work is not.

I wrote before that when making things gets cheap, [choosing what to make](/blog/taste-is-the-last-moat/) becomes the scarce skill. Running agents taught me the other half. Once something is made, you have to know whether it's true, and that doesn't get cheaper just because the making did.

## Comments are not gates

Early on, safety lived in comments. Someone would write "hold" on a pull request and expect that to stop it. One day a hold comment sat on a change and auto-merge shipped it anyway. It put wrong generated text into production, and we rolled it back twenty minutes later. After that the hold became a required check that blocks the merge. A comment asks. A check refuses.

The checks have to be exact in ways I didn't expect. Every agent posts to GitHub as the same user, so "who approved this" can't come from the author field. The approval check has to look for explicit verdict words at the exact commit being merged.

Even conventions broke in odd ways. Agents signed handoffs like "QA: ready at abc123". The script that wakes each agent skipped comments that looked self-authored, and a comment starting with "QA:" looked like QA had written it. So QA never woke up for work addressed to it. The fix was an arrow, "→ QA:", plus a rule to test any convention against the script's real regular expressions before adopting it.

Another time, the release script only checked QA's verdict. A change touching money and a database migration shipped without the CTO's review. A later review found it sound. But that was luck, so now every required approval is encoded in the script, not only the ones I happened to think of first.

## A gate you haven't seen fail is a guess

The most useful habit I picked up is breaking my own tests on purpose.

AdBrain's merge gate replays recorded responses from real production runs, not hand-written mocks. Before I trusted it, I broke the code in the ways I was afraid of: made the validator always pass, made it always fail, changed the planner's time limit, created ads as active instead of paused. Each break had to turn the gate red. If a change I feared couldn't turn it red, the gate wasn't protecting me from that change.

This matters more with agents than with people. An agent will happily write a test that passes, and a passing test tells you nothing about whether it can fail. So every production fix to the core flow now ships with a test shown to fail on main without the fix. That's a repo rule.

The same goes for claims about the world. A decision once rested on "three real sign-ups." They were QA's own test accounts. A red mark on a commit looked like an incident, but it was an older run that a newer one had already replaced. Agents report what they see with total confidence, and what they see is often a test account or a stale run. I distrust every claim until I've reproduced it.

## One writer per file

Parallel agents in one repository will destroy each other's work without meaning to.

Each worker now edits only its own git worktree, never my checkout. One agent owns a given file at a time. No one runs `git add -A`, because it sweeps in whatever another agent left in the shared index. These sound like hygiene rules. Each came from a near miss.

Worktrees share references, so `main` can move between the moment a branch is rebased and the moment it merges. One merge commit would have reset eight files and silently reverted three other pull requests. A comparison against the real target caught it, so now the diff gets checked before auto-merge is turned on. Another time one agent pushed a conflict fix onto a colleague's branch while that colleague was rebasing it. The rebase replaced the fix. Now conflict fixes go to the branch's author.

The pattern underneath is simple. Agents don't coordinate by noticing each other. They coordinate only through what's written down and enforced: who owns the file, which commit was approved, which check is required. Anything left to good manners gets trampled.

## The machine under the team

Some of the costliest failures weren't in the code at all.

After a VS Code restart, every chat came back with an empty transcript and refused messages. The team was dead and nothing said so. My Mac slept on battery twice, and the team went dark for twelve hours each time. Five chats once sat stuck on dead tool calls for hours while the interface still said "in progress." Their recent comments looked like activity. They weren't.

So I check liveness directly now: which waiter processes are running, what each chat's last turn actually was. Every role has a stored restart prompt, and the state lives in GitHub and git, not in any chat's memory. With that in place, the last time the editor restarted, all eight roles were back at work within two minutes. And on an 8 GB laptop, the limit isn't how many chats are open. It's how many run heavy jobs at once.

## What survived

Most of the process I added, I later removed: staging, extra approvals, reports, the rule that branches be up to date. The team got faster. What stayed were structural brakes. A core test gate built from recorded responses. A production smoke test after every deploy, with automatic rollback. Hard stops on money, secrets and actions in the outside world that can't be undone.

That's the shape that held up. Let agents write freely. Let checks, not conversations, decide what ships. Prove each check by watching it fail. Keep the human on the decisions that can't be reversed.

The agents are good at producing code. My part turned out to be defining what counts as done.
