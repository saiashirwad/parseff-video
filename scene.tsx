import { Code, highlight, type Highlighted } from "@svjeez/code";
import ocaml from "shiki/langs/ocaml.mjs";
import { google } from "@svjeez/fonts";
import { Icon } from "@svjeez/icons";
import { arrowBackUp, arrowsSplit, cpu, feather, scissors, waveSine } from "@svjeez/icons/tabler";
import {
  Align,
  Center,
  Grid,
  Group,
  Run,
  Sequence,
  Shape,
  Stack,
  Text,
  alpha,
  circle,
  count,
  ease,
  enter,
  exit,
  linear,
  path,
  rect,
  scaled,
  scene,
  span,
  tokens,
  track,
  type Anim,
  type Child,
  type Paint,
  type SceneElement,
  type Span,
  type Vec,
} from "svjeez";
import type { Common, TextChild } from "svjeez/tools";

const theme = tokens({
  light: {
    background: "#F7F7F5",
    surface: "#FFFFFF",
    raised: "#EDEDEA",
    border: "#E2E1DD",
    dots: "#E2E1DD",
    muted: "#5C5B57",
    text: "#111110",
    accent: "#3A6A99",
    red: "#AF3029",
    green: "#566C09",
    yellow: "#8A6A00",
    orange: "#BC5215",
    teal: "#1D6E68",
  },
  dark: {
    background: "#0A0A0A",
    surface: "#141414",
    raised: "#222222",
    border: "#2A2A2A",
    dots: "#242322",
    muted: "#9F9D96",
    text: "#ECEBE4",
    accent: "#7CACF8",
    red: "#E8705F",
    green: "#A3B550",
    yellow: "#D0A215",
    orange: "#E58A4E",
    teal: "#3AA99F",
  },
});

const sans = await google.family("Geist", [{ weight: 400 }, { weight: 600 }], {
  ligatures: false,
});

const display = await google("Geist", { weight: 600, ligatures: false });
const mono = await google("Geist Mono", { ligatures: false });
const monoBold = await google("Geist Mono", { weight: 600, ligatures: false });

const palette = {
  plain: theme.text,
  comment: theme.muted,
  punctuation: theme.muted,
  keyword: theme.orange,
  string: theme.green,
  number: theme.yellow,
  constant: theme.yellow,
  variable: theme.text,
  function: theme.accent,
  type: theme.teal,
  tag: theme.teal,
  inserted: theme.green,
  deleted: theme.red,
};

const W = 1280;
const H = 720;

const OCAML = scaled(path.parse("M12.178 21.637c-.085-.17-.187-.524-.255-.676-.067-.135-.27-.506-.37-.625-.22-.253-.27-.27-.338-.608-.12-.574-.405-1.588-.76-2.296-.187-.372-.49-.677-.761-.947-.236-.236-.777-.624-.878-.607-.895.169-1.166 1.046-1.587 1.739-.237.388-.473.71-.66 1.115-.167.371-.151.793-.439 1.115a2.952 2.952 0 00-.624 1.097c-.034.084-.101.929-.186 1.131l1.318-.084c1.233.085.877.557 2.787.456l3.022-.1a5.376 5.376 0 00-.27-.71zM20.96 1.539H3.023A3.02 3.02 0 000 4.56v6.587c.44-.152 1.047-1.08 1.25-1.3.337-.389.405-.895.574-1.2.389-.709.456-1.215 1.334-1.215.406 0 .575.1.845.473.186.253.523.743.675 1.064.186.371.474.86.609.962.1.068.185.136.27.17.135.05.253-.051.354-.12.118-.1.17-.286.287-.556.17-.39.339-.827.44-.997.169-.27.236-.608.422-.76.27-.236.641-.253.743-.27.557-.118.81.27 1.08.507.186.168.423.49.609.91.135.339.304.661.388.846.068.185.237.49.338.86.101.322.337.575.44.744 0 0 .152.406 1.03.778a7.505 7.505 0 00.81.286c.39.135.76.12 1.233.068.338 0 .524-.49.676-.878.084-.237.185-.895.236-1.081.05-.185-.085-.32.034-.49.135-.186.22-.203.287-.439.17-.523 1.114-.54 1.655-.54.456 0 .389.44 1.149.287.439-.085.86.05 1.318.185.388.102.76.22.98.473.134.17.489.997.134 1.031.033.033.067.118.118.151-.085.322-.422.085-.625.051-.253-.05-.44 0-.693.118-.439.187-1.063.17-1.452.49-.32.271-.32.861-.473 1.2 0 0-.422 1.063-1.317 1.722-.237.17-.692.574-1.672.726-.44.068-.86.068-1.318.05-.22-.016-.438-.016-.658-.016-.136 0-.575-.017-.558.034l-.05.119a.6.6 0 00.033.169c.017.1.017.185.034.27 0 .185-.017.388 0 .574.017.388.17.743.186 1.148.017.44.236.913.456 1.267.085.135.203.152.254.32.067.186 0 .406.033.609.118.794.355 1.638.71 2.364v.017c.439-.067.895-.236 1.47-.32 1.063-.153 2.532-.085 3.478-.17 2.399-.22 3.7.98 5.844.49V4.562a3.045 3.045 0 00-3.04-3.023zm-8.951 14.187c0-.034 0-.034 0 0zm-6.47 2.769c.17-.372.271-.778.406-1.15.135-.354.337-.86.693-1.046-.05-.05-.744-.068-.929-.085a7.406 7.406 0 01-.608-.084 22.976 22.976 0 01-1.15-.236c-.22-.051-.979-.322-1.13-.39-.39-.168-.642-.658-.93-.607-.185.034-.37.101-.49.287-.1.152-.134.423-.202.608-.084.203-.22.405-.32.608-.238.354-.626.676-.795 1.03-.033.085-.05.169-.084.254v4.07c.202.034.405.068.624.135 1.69.456 2.095.49 3.75.304l.152-.017c.118-.27.22-1.165.304-1.435.067-.22.153-.39.187-.591.033-.203 0-.406-.017-.59-.034-.491.354-.661.54-1.065z"), 26 / 24);

const SHOTS = [4.4, 9.0, 8.4, 8.2, 6.0, 6.0, 4.2, 4.6] as const;
const starts = SHOTS.map((_, i) => SHOTS.slice(0, i).reduce((a, b) => a + b, 0));
const FADE = 0.4;
const shot = (i: number): Span => (i === 0 ? span(0, SHOTS[0]) : span(starts[i]! - FADE, SHOTS[i]! + FADE));

// The direct-style shot hands its card to typed errors: it ends HANDOFF early with no fade of its own, and typed errors starts that much sooner.
const HANDOFF = 0.3;
const handed = (i: number): Span => (i === 1 ? span(starts[1]! - FADE, SHOTS[1]) : span(starts[2]! - FADE - HANDOFF, SHOTS[2] + FADE + HANDOFF));

const Shot = ({ when, fadeIn = true, fadeOut = true, children }: { when: Span; fadeIn?: boolean; fadeOut?: boolean; children: Child }): SceneElement => (
  <Sequence when={when}>
    <Group
      motion={[
        fadeIn && enter(span(0, FADE), { from: { opacity: 0 }, curve: ease.inOut }),
        fadeOut && exit(span(when.over - FADE, FADE), { to: { opacity: 0 }, curve: ease.inOut }),
      ]}
    >
      {children}
    </Group>
  </Sequence>
);

const Heading = ({ opacity, children }: { opacity?: Anim<number>; children: TextChild }): SceneElement => (
  <Text font={sans} weight={600} size={56} at={[80, 64]} anchor="top-left" fill={theme.text} opacity={opacity}>
    {children}
  </Text>
);

// An identifier inside prose.
const Id = ({ children }: { children: string }): SceneElement => (
  <Run font={mono} fill={theme.text}>
    {children}
  </Run>
);

const Deck = ({ opacity, motion, children }: { opacity?: Anim<number>; motion?: Common["motion"]; children: TextChild }): SceneElement => (
  <Text font={sans} size={22} at={[80, 140]} fill={theme.muted} opacity={opacity} motion={motion}>
    {children}
  </Text>
);

const cw = (size: number) => mono.measure("0", size);

// 1. The mark draws itself, settles, and the wordmark slides out of it.
const Intro = (): SceneElement => (
  <Align place="center">
    <Stack gap={20} align="center" motion={{ offset: [0, -20] }}>
      <Text
        font={display}
        size={168}
        fill={theme.text}
        motion={enter(span(0.2, 1.0), { from: { opacity: 0, offset: [0, 24], scale: 0.94 }, curve: ease.spring({ stiffness: 140, damping: 16 }) })}
      >
        parseff
      </Text>
      <Stack direction="row" gap={10} align="center" motion={enter(span(1.1, 0.6), { from: { opacity: 0, offset: [0, 10] } })}>
        <Text font={sans} size={26} fill={theme.muted}>
          Direct-style parser combinators for
        </Text>
        <Shape geometry={OCAML} fill="#EE6A1A" />
        <Text font={sans} weight={600} size={26} fill={theme.text}>
          OCaml 5
        </Text>
      </Stack>
    </Stack>
  </Align>
);

// 2. Angstrom's binds light up, then each one dissolves: the bound name travels to the front of its line as let name = … in.
const ANGSTROM = `let key_value =
  take_while1 (fun c -> c <> ':') >>= fun key ->
  char ':' >>= fun _ ->
  skip_while is_ws >>= fun () ->
  take_while1 (fun c -> c <> '\\n') >>= fun value ->
  return (key, value)`;

const PARSEFF = `let key_value () =
  let key = take_while ~at_least:1 (fun c -> c <> ':') in
  let _ = char ':' in
  skip_whitespace ();
  let value = take_while ~at_least:1 (fun c -> c <> '\\n') in
  (key, value)`;

const BEFORE = highlight(ANGSTROM, "ocaml", { grammars: [ocaml] });
const AFTER = highlight(PARSEFF, "ocaml", { grammars: [ocaml] });

// The shared card: the direct-style shot's size, then the typed-errors shot's.
const CARD: Vec = [80, 236];
const CODE_SIZE = 26;
const col = (c: number) => 136 + c * cw(CODE_SIZE);
const row = (i: number) => 296 + i * 44;

// The pieces of one line of highlighted code from column `from`, `len` long.
const piecesOf = (code: Highlighted, line: number, from: number, len: number) => {
  let at = 0;

  return code[line]!.flatMap(([role, text]) => {
    const [start, a, b] = [at, Math.max(at, from), Math.min(at + text.length, from + len)];
    at += text.length;

    return b > a ? [{ role, text: text.slice(a - start, b - start) }] : [];
  });
};

const roleAt = (code: Highlighted, line: number, c: number) => palette[piecesOf(code, line, c, 1)[0]!.role];

// One token or run of tokens, set at its column, colored by role unless given a fill.
const Tok = ({ code, line, from, len, at, fill, opacity }: { code: Highlighted; line: number; from: number; len: number; at?: Anim<Vec>; fill?: Anim<Paint>; opacity?: Anim<number> }): SceneElement => {
  const pieces = piecesOf(code, line, from, len);

  return (
    <Text font={mono} size={CODE_SIZE} at={at ?? [col(from), row(line)]} fill={fill ?? theme.text} opacity={opacity}>
      {fill ? pieces.map((p) => p.text).join("") : pieces.map((p) => <Run fill={palette[p.role]}>{p.text}</Run>)}
    </Text>
  );
};

// Columns are Angstrom's (`from`) and Parseff's (`to`, `adds`, `ins`).
type Plan = {
  line: number;
  moves: readonly { from: number; len: number; to: number; quick?: boolean }[];
  outs?: readonly { from: number; len: number; to: number }[];
  ins?: readonly { from: number; len: number; start: number }[];
  binds: readonly (readonly [number, number])[];
  name?: { from: number; len: number; to: number };
  adds: readonly (readonly [number, number])[];
};

const PLANS: readonly Plan[] = [
  {
    line: 1,
    moves: [{ from: 2, len: 10, to: 12 }, { from: 14, len: 19, to: 35, quick: true }],
    outs: [{ from: 12, len: 1, to: 22 }],
    ins: [{ from: 23, len: 11, start: 13 }],
    binds: [[34, 3], [38, 3], [46, 2]],
    name: { from: 42, len: 3, to: 6 },
    adds: [[2, 3], [10, 1], [55, 2]],
  },
  {
    line: 2,
    moves: [{ from: 2, len: 8, to: 10 }],
    binds: [[11, 3], [15, 3], [21, 2]],
    name: { from: 19, len: 1, to: 6 },
    adds: [[2, 3], [8, 1], [19, 2]],
  },
  {
    line: 3,
    moves: [{ from: 2, len: 8, to: 2 }],
    outs: [{ from: 10, len: 8, to: 10 }],
    ins: [{ from: 10, len: 10, start: 10 }],
    binds: [[19, 3], [23, 3], [27, 2], [30, 2]],
    adds: [[20, 1]],
  },
  {
    line: 4,
    moves: [{ from: 2, len: 10, to: 14 }, { from: 14, len: 20, to: 37, quick: true }],
    outs: [{ from: 12, len: 1, to: 24 }],
    ins: [{ from: 25, len: 11, start: 13 }],
    binds: [[35, 3], [39, 3], [49, 2]],
    name: { from: 43, len: 5, to: 6 },
    adds: [[2, 3], [12, 1], [58, 2]],
  },
];

const DirectStyle = (): SceneElement => {
  const w = 1120;
  const dim = span(1.7, 0.4);
  const flagged = span(1.7, 0.16).cascade(4, 0.08);
  const starts = span(3.2, 0.65).cascade(4, 0.18);
  const tail = span(4.5, 0.5);
  const head = span(5.2, 0.3);
  const leave = span(8.2, 0.25);
  const faded = track(1).to(0.3, dim);
  const slideAt = (line: number, from: number, to: number, when: Span) => track<Vec>([col(from), row(line)]).to([col(to), row(line)], when, ease.inOut);

  return (
    <Group>
      <Text font={mono} size={14} at={[CARD[0] + w - 24, 262]} anchor="right" fill={theme.muted} opacity={track(1).to(0, span(tail.start, 0.25))}>
        Angstrom
      </Text>
      <Text font={mono} size={14} at={[CARD[0] + w - 24, 262]} anchor="right" fill={theme.muted} opacity={track(0).to(1, span(tail.start + 0.25, 0.25)).to(0, leave)}>
        Parseff
      </Text>
      <Deck opacity={track(0).to(1, dim).to(0, span(tail.start, 0.25))}>
        Angstrom sequences steps with <Id>{">>="}</Id>.
      </Deck>
      <Deck opacity={track(0).to(1, span(tail.start + 0.25, 0.25)).to(0, leave)}>
        Parseff sequences them with <Id>let … in</Id>.
      </Deck>
      <Group motion={exit(leave, { to: { opacity: 0 }, curve: ease.inOut })}>
        <Tok code={BEFORE} line={0} from={0} len={13} opacity={faded.to(1, span(starts[0].start + 0.1, 0.55))} />
        <Tok code={BEFORE} line={0} from={14} len={1} at={slideAt(0, 14, 17, head)} opacity={faded.to(1, span(starts[0].start + 0.1, 0.55))} />
        <Tok code={AFTER} line={0} from={14} len={2} fill={theme.accent} opacity={track(0).to(1, span(head.start + 0.15, 0.25))} />
        {PLANS.map((plan, n) => {
          const t0 = starts[n]!.start;
          const slide = span(t0 + 0.1, 0.55);
          const quick = span(t0 + 0.1, 0.45);
          const { line } = plan;

          return (
            <Group key={"line" + line}>
              {plan.binds.map(([from, len]) => (
                <Tok
                  key={"bind" + from}
                  code={BEFORE}
                  line={line}
                  from={from}
                  len={len}
                  fill={track(roleAt(BEFORE, line, from)).to(theme.red, flagged[n]!)}
                  opacity={track(1).to(0, span(t0, 0.25), ease.in)}
                />
              ))}
              {plan.moves.map((m) => (
                <Tok
                  key={"move" + m.from}
                  code={BEFORE}
                  line={line}
                  from={m.from}
                  len={m.len}
                  at={slideAt(line, m.from, m.to, m.quick ? quick : slide)}
                  opacity={faded.to(1, span(slide.end - 0.1, 0.35))}
                />
              ))}
              {plan.outs?.map((o) => (
                <Tok
                  key={"out" + o.from}
                  code={BEFORE}
                  line={line}
                  from={o.from}
                  len={o.len}
                  at={slideAt(line, o.from, o.to, slide)}
                  opacity={faded.to(0, span(slide.start, 0.25))}
                />
              ))}
              {plan.ins?.map((o) => (
                <Tok
                  key={"in" + o.from}
                  code={AFTER}
                  line={line}
                  from={o.from}
                  len={o.len}
                  at={slideAt(line, o.start, o.from, slide)}
                  opacity={track(0).to(1, span(slide.start + 0.3, 0.25))}
                />
              ))}
              {plan.name && (
                <Tok
                  code={BEFORE}
                  line={line}
                  from={plan.name.from}
                  len={plan.name.len}
                  at={slideAt(line, plan.name.from, plan.name.to, slide)}
                  fill={track(roleAt(BEFORE, line, plan.name.from))
                    .to(theme.red, flagged[n]!)
                    .to(roleAt(AFTER, line, plan.name.to), slide)}
                />
              )}
              {plan.adds.map(([from, len]) => (
                <Tok
                  key={"add" + from}
                  code={AFTER}
                  line={line}
                  from={from}
                  len={len}
                  fill={track(theme.accent).to(roleAt(AFTER, line, from), span(t0 + 0.7, 0.4))}
                  opacity={track(0).to(1, span(t0 + 0.45, 0.25), ease.in)}
                />
              ))}
            </Group>
          );
        })}
        <Tok code={BEFORE} line={5} from={2} len={6} opacity={faded.to(0, span(tail.start, 0.2))} />
        <Tok code={BEFORE} line={5} from={9} len={12} at={slideAt(5, 9, 2, span(tail.start + 0.05, 0.45))} opacity={faded.to(1, span(tail.start + 0.05, 0.45))} />
      </Group>
    </Group>
  );
};

// The card and the headline carry over from the direct-style shot into typed errors, so they never blink.
const Handoff = ({ when }: { when: Span }): SceneElement => {
  const resize = span(8.3, 0.6);

  return (
    <Sequence when={when}>
      <Group motion={[enter(span(0, FADE), { curve: ease.inOut }), exit(span(when.over - FADE, FADE), { to: { opacity: 0 }, curve: ease.inOut })]}>
        <Shape
          geometry={track(rect(1120, 384, { radius: 10 })).to(rect(540, 250, { radius: 10 }), resize, ease.inOut)}
          at={CARD}
          fill={theme.surface}
          stroke={{ color: theme.border, width: 1 }}
        />
        <Heading opacity={track(1).to(0, span(resize.start, 0.3))}>
          A parser is <Run font={monoBold}>{"unit -> 'a"}</Run>.
        </Heading>
        <Heading opacity={track(0).to(1, span(resize.start + 0.3, 0.3))}>Domain errors are variants.</Heading>
      </Group>
    </Sequence>
  );
};

// 3. The octet parser on the left; on the right a cursor walks an IP address and the last octet fails with a typed error.
const OCTET = "type Parseff.custom_error += Out_of_range of int\n\nlet octet () =\n  let n = Parseff.integer () in\n  if n > 255 then Parseff.error (Out_of_range n)\n  else n";

const TypedErrors = (): SceneElement => {
  const [cx, cwid] = [CARD[0], 540];
  const cs = 15;
  const cl = cs * 1.8;
  const codeAt: Vec = [108, 280];
  const arrive = span(0, HANDOFF);
  const size = 52;
  const c = cw(size);
  const input = "192.168.1.256";
  const mid = 930;
  const x0 = mid - (input.length * c) / 2;
  const ty = 256;
  const octets = [
    { from: 0, to: 3, label: "192" },
    { from: 4, to: 7, label: "168" },
    { from: 8, to: 9, label: "1" },
    { from: 10, to: 13, label: "256 > 255" },
  ];
  const moves = span(0.9 + HANDOFF, 0.6).cascade(4, 1.4);
  const fail = span(moves[3].end, 0.3);
  const by = ty + 84;
  const line = (n: number) => codeAt[1] + n * cl - 5;

  return (
    <Group>
      <Text font={mono} size={14} at={[cx + cwid - 24, 262]} anchor="right" fill={theme.muted} motion={enter(arrive, { curve: ease.inOut })}>
        ip.ml
      </Text>
      <Shape
        geometry={rect(cwid - 2, cl)}
        at={octets.reduce(
          (t, _, i) => {
            const back = i === 0 ? t : t.to([cx + 1, line(3)], span(moves[i]!.start, 0.3), ease.inOut);

            return back.to([cx + 1, line(i === 3 ? 4 : 5)], span(moves[i]!.end, 0.3), ease.inOut);
          },
          track<Vec>([cx + 1, line(3)]),
        )}
        fill={octets.reduce(
          (t, _, i) => {
            const back = i === 0 ? t : t.to(alpha(theme.accent, 0.16), span(moves[i]!.start, 0.3));

            return back.to(alpha(i === 3 ? theme.red : theme.green, 0.2), span(moves[i]!.end, 0.3));
          },
          track(alpha(theme.accent, 0.16)),
        )}
        motion={enter(span(moves[0].start - 0.2, 0.3))}
      />
      <Code lang="ocaml" grammars={[ocaml]} font={mono} size={cs} lineHeight={1.8} palette={palette} at={codeAt} motion={enter(arrive, { curve: ease.inOut })}>
        {OCTET}
      </Code>
      <Text font={mono} size={size} at={[x0, ty]} fill={theme.text} motion={enter(arrive, { curve: ease.inOut })}>
        192.168.1.<Run fill={track(theme.text).to(theme.red, fail)}>256</Run>
      </Text>
      <Shape
        geometry={rect(3, 70)}
        at={octets.reduce(
          (t, o, i) => t.to([x0 + o.to * c + 2, ty - 2], moves[i]!, ease.inOut),
          track<Vec>([x0 - 6, ty - 2]),
        )}
        fill={track(theme.accent).to(theme.red, fail)}
        motion={enter(span(0.6 + HANDOFF, 0.3))}
      />
      {octets.map((o, i) => {
        const bad = i === 3;
        const [a, b] = [x0 + o.from * c + 3, x0 + o.to * c - 3];
        const at = span(moves[i]!.end - 0.1, 0.35);

        return (
          <Group key={"octet" + i}>
            <Shape
              geometry={path().moveTo([a, by - 8]).lineTo([a, by]).lineTo([b, by]).lineTo([b, by - 8])}
              stroke={{ color: bad ? theme.red : theme.green, width: 2, cap: "round", join: "round" }}
              draw={track(0).to(1, at)}
            />
            <Text
              font={mono}
              size={15}
              at={[(a + b) / 2, by + 14]}
              anchor="top"
              fill={bad ? theme.red : theme.green}
              motion={enter(at.shift(0.1), { from: { opacity: 0, offset: [0, -6] } })}
            >
              {o.label}
            </Text>
          </Group>
        );
      })}
      <Stack
        at={[660, 410]}
        anchor="top-left"
        width={540}
        radius={8}
        gap={8}
        padding={[22, 16]}
        fill={alpha(theme.red, 0.1)}
        motion={enter(span(fail.end + 0.2, 0.5), { from: { opacity: 0, offset: [0, 14] } })}
      >
        <Text font={mono} size={17} fill={theme.red}>
          Error
        </Text>
        <Text font={mono} size={17} fill={theme.text}>
          {"{ kind = Custom (Out_of_range 256); _ }"}
        </Text>
      </Stack>
      <Deck motion={enter(span(fail.end + 0.6, 0.5), { from: { opacity: 0, offset: [0, 8] } })}>
        <Id>Parseff.error e</Id> fails with <Id>kind = Custom e</Id>.
      </Deck>
    </Group>
  );
};

// 4. One pass over broken input: holes where it fails, every error reported.
const Recovery = (): SceneElement => {
  const size = 40;
  const c = cw(size);
  const input = "let x = 1; let y = ; let z = 3; let = 4;";
  const x0 = 80;
  const ty = 250;
  const by = ty + 68;
  const stmts = [
    { from: 0, to: 10, node: 'Let ("x", 1)', ok: true },
    { from: 11, to: 20, node: "Hole", ok: false, at: 19 },
    { from: 21, to: 31, node: 'Let ("z", 3)', ok: true },
    { from: 32, to: 40, node: "Hole", ok: false, at: 36 },
  ];
  const reset = 3.2;
  const stop = span(1.2, 0.35);
  const moves = span(reset + 0.3, 0.42).cascade(4, 0.5);
  const report = span(moves[3].end + 0.4, 0.3).cascade(5, 0.12);
  const modes = [
    { text: "Parseff.parse input statements", opacity: track(0).to(1, span(0.3, 0.3)).to(0, span(reset - 0.3, 0.3)) },
    { text: "Parseff.parse ~diagnostics:errors input statements", opacity: track(0).to(1, span(reset, 0.3)) },
  ];
  const diag = [
    { pos: "1:20:", msg: " expected integer, found ';'" },
    { caret: 19 },
    { pos: "1:37:", msg: " expected identifier, found '='" },
    { caret: 36 },
  ];
  const ds = 17;

  return (
    <Group>
      <Heading>Recover: record, sync, return a hole.</Heading>
      {stmts.map((s, i) =>
        s.ok ? null : (
          <Shape
            key={"bad" + i}
            geometry={rect(c, 52, { radius: 4 })}
            at={[x0 + (s.at ?? 0) * c, ty - 3]}
            fill={alpha(theme.red, 0.28)}
            motion={enter(i === 1 ? span(stop.end - 0.05, 0.25) : span(moves[i]!.end - 0.05, 0.25))}
          />
        ),
      )}
      {modes.map((m) => (
        <Text key={m.text} font={mono} size={20} at={[80, 140]} fill={theme.muted} opacity={m.opacity}>
          {m.text}
        </Text>
      ))}
      <Text font={mono} size={size} at={[x0, ty]} fill={theme.text}>
        {input}
      </Text>
      <Stack
        direction="row"
        gap={12}
        align="center"
        at={[80, by + 40]}
        anchor="top-left"
        padding={[18, 10]}
        radius={6}
        fill={alpha(theme.red, 0.1)}
        motion={[enter(span(stop.end + 0.15, 0.35), { from: { opacity: 0, offset: [0, 8] } }), exit(span(reset - 0.4, 0.3))]}
      >
        <Text font={mono} size={16} fill={theme.text}>
          <Run fill={theme.muted}>1:20:</Run> <Run fill={theme.red}>[error]</Run> expected integer, found ';'
        </Text>
        <Text font={sans} size={17} fill={theme.muted}>
          Without <Id>~diagnostics</Id>, recovery stops at the first error.
        </Text>
      </Stack>
      <Shape
        geometry={rect(2, 58, { radius: 1 })}
        at={stmts.reduce(
          (t, s, i) => t.to([x0 + s.to * c, ty - 6], moves[i]!, ease.inOut),
          track<Vec>([x0 - 4, ty - 6])
            .to([x0 + 10 * c, ty - 6], span(0.7, 0.42), ease.inOut)
            .to([x0 + 19 * c, ty - 6], stop, ease.inOut)
            .set([x0 - 4, ty - 6], span(reset)),
        )}
        fill={track(theme.accent).to(theme.red, span(stop.end, 0.2)).set(theme.accent, span(reset))}
        motion={[enter(span(0.5, 0.3)), exit(span(moves[3].end + 0.2, 0.3))]}
      />
      {stmts.map((s, i) => {
        const [a, b] = [x0 + s.from * c + 3, x0 + s.to * c - c - 3];
        const mid = (a + b) / 2;
        const color = s.ok ? theme.green : theme.red;
        const at = span(moves[i]!.end - 0.1, 0.35);

        return (
          <Group key={"stmt" + i}>
            <Shape
              geometry={path().moveTo([a, by - 8]).lineTo([a, by]).lineTo([b, by]).lineTo([b, by - 8])}
              stroke={{ color, width: 2, cap: "round", join: "round" }}
              draw={track(0).to(1, at)}
            />
            <Shape
              geometry={path().moveTo([mid, by]).lineTo([mid, by + 34])}
              stroke={{ color: alpha(color, 0.6), width: 1.5, cap: "round" }}
              draw={track(0).to(1, at.next(0.25))}
            />
            <Center
              at={[mid, by + 36]}
              anchor="top"
              padding={[14, 7]}
              radius={6}
              fill={alpha(color, 0.1)}
              stroke={{ color: alpha(color, 0.6), width: 1 }}
              motion={enter(at.next(0.35, 0.1), { from: { opacity: 0, scale: 0.8 }, curve: ease.pop })}
            >
              <Text font={mono} size={17} fill={color}>
                {s.node}
              </Text>
            </Center>
          </Group>
        );
      })}
      <Stack
        at={[80, 440]}
        anchor="top-left"
        width={1120}
        gap={4}
        padding={[28, 20]}
        radius={8}
        fill={theme.surface}
        stroke={{ color: theme.border, width: 1 }}
        motion={enter(span(report[0].start - 0.2, 0.4), { from: { opacity: 0, offset: [0, 16] } })}
      >
        {diag.map((d, i) =>
          d.caret === undefined ? (
            <Text key={"d" + i} font={mono} size={ds} fill={theme.text} motion={enter(report[i]!, { from: { opacity: 0, offset: [-8, 0] } })}>
              <Run fill={theme.muted}>{d.pos}</Run> <Run fill={theme.red}>[error]</Run>
              {d.msg}
            </Text>
          ) : (
            <Group key={"d" + i} motion={enter(report[i]!, { from: { opacity: 0, offset: [-8, 0] } })}>
              <Text font={mono} size={ds} fill={theme.muted}>
                {"1 | " + input}
              </Text>
              <Text font={mono} size={ds} at={[0, ds * 1.3]} fill={theme.muted}>
                {"  | " + " ".repeat(d.caret)}
                <Run fill={theme.red}>^</Run>
              </Text>
            </Group>
          ),
        )}
      </Stack>
    </Group>
  );
};

// 5. Push streaming: chunks split mid-token, the parser is unchanged.
const STREAM = "let line () =\n  let s = take_while (fun c -> c <> '\\n') in\n  let _ = char '\\n' in\n  s\n\nlet t = Push.parse line\nlet _ = Push.feed t \"ab\"\nlet _ = Push.feed t \"c\\nd\"";

const Streaming = (): SceneElement => {
  const [cx, cy, cwid, chei] = [80, 236, 540, 304];
  const cs = 15;
  const cl = cs * 1.8;
  const codeAt: Vec = [cx + 28, cy + 70];
  const line = (n: number) => codeAt[1] + n * cl - 5;
  const [tx, ty, tw, th] = [660, 262, 540, 76];
  const arrive = span(1.0, 0.7).cascade(2, 1.6);
  const chunks = [
    { text: '"ab"', x: tx + 18 },
    { text: '"c\\nd"', x: tx + 18 + cw(20) * 4 + 28 + 12 },
  ];

  return (
    <Group>
      <Heading>Incremental push parsing.</Heading>
      <Shape geometry={rect(cwid, chei, { radius: 10 })} at={[cx, cy]} fill={theme.surface} stroke={{ color: theme.border, width: 1 }} />
      {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((color, i) => (
        <Shape key={"dot" + i} geometry={circle(6)} at={[cx + 26 + i * 20, cy + 24]} anchor="center" fill={color} />
      ))}
      <Shape geometry={rect(cwid - 2, 1)} at={[cx + 1, cy + 48]} fill={theme.border} />
      <Text font={mono} size={13} at={[cx + cwid / 2, cy + 24]} anchor="center" fill={theme.muted}>
        lines.ml
      </Text>
      <Shape
        geometry={rect(cwid - 2, cl)}
        at={track<Vec>([cx + 1, line(6)]).to([cx + 1, line(7)], span(arrive[1].start, 0.3), ease.inOut)}
        fill={track(alpha(theme.accent, 0.16)).to(alpha(theme.green, 0.2), span(arrive[1].end, 0.3))}
        motion={enter(span(arrive[0].start - 0.2, 0.3))}
      />
      <Code lang="ocaml" font={mono} size={cs} lineHeight={1.8} palette={palette} at={codeAt}>
        {STREAM}
      </Code>
      <Text font={mono} size={13} at={[tx, 236]} fill={theme.muted}>
        line ()
      </Text>
      <Shape geometry={rect(tw, th, { radius: 10 })} at={[tx, ty]} fill={theme.surface} stroke={{ color: theme.border, width: 1 }} />
      {chunks.map((ch, i) => (
        <Center
          key={ch.text}
          at={[ch.x, ty + th / 2]}
          anchor="left"
          padding={[14, 8]}
          radius={6}
          fill={alpha(theme.accent, 0.14)}
          motion={enter(arrive[i]!, { from: { opacity: 0, offset: [260, 0] }, curve: ease.spring({ stiffness: 170, damping: 20 }) })}
        >
          <Text font={mono} size={20} fill={theme.accent}>
            {ch.text}
          </Text>
        </Center>
      ))}
      <Text
        font={mono}
        size={24}
        at={[660, 372]}
        fill={theme.muted}
        motion={[enter(span(arrive[0].end, 0.3)), exit(span(arrive[1].start + 0.3, 0.25))]}
      >
        Await
      </Text>
      <Text
        font={mono}
        size={24}
        at={[660, 372]}
        fill={theme.green}
        motion={enter(span(arrive[1].end + 0.1, 0.4), { from: { opacity: 0, offset: [0, 8] } })}
      >
        {'Done (Ok ("abc", "d"))'}
      </Text>
      <Deck motion={enter(span(arrive[1].end + 0.7, 0.5), { from: { opacity: 0, offset: [0, 8] } })}>
        <Id>Push.feed t chunk</Id> returns <Id>Await</Id> or <Id>Done (Ok (value, leftover))</Id>.
      </Deck>
    </Group>
  );
};

// 6. JSON throughput bars, and the allocation gap.
const Performance = (): SceneElement => {
  const rows = [
    { name: "Parseff", kind: "optimized", v: 2.47, color: theme.accent },
    { name: "Parseff", kind: "generic", v: 1.74, color: alpha(theme.accent, 0.55) },
    { name: "Angstrom", kind: "optimized", v: 1.72, color: theme.border },
    { name: "Angstrom", kind: "generic", v: 1.26, color: theme.border },
  ];
  const grow = span(0.8, 1.1).cascade(4, 0.12);
  const [bx, top, rowH, maxW] = [300, 270, 70, 440];

  return (
    <Group>
      <Heading>1.4× Angstrom's JSON throughput.</Heading>
      <Text font={mono} size={13} at={[80, top - 34]} fill={theme.muted}>
        json parses per second
      </Text>
      {rows.map((r, i) => {
        const y = top + i * rowH;

        return (
          <Group key={"row" + i}>
            <Text font={sans} size={20} at={[80, y + 15]} anchor="left" fill={theme.text}>
              {r.name} <Run fill={theme.muted}>{r.kind}</Run>
            </Text>
            <Shape geometry={rect(maxW, 30, { radius: 6 })} at={[bx, y]} fill={theme.raised} />
            <Shape
              geometry={track(rect(4, 30, { radius: 6 })).to(rect((r.v / 2.47) * maxW, 30, { radius: 6 }), grow[i]!, ease.out)}
              at={[bx, y]}
              fill={r.color}
            />
            <Text font={mono} size={18} at={[bx + maxW + 20, y + 15]} anchor="left" fill={i === 0 ? theme.accent : theme.muted}>
              {count(track(0).to(r.v, grow[i]!), { format: (n) => n.toFixed(2) + "M", rate: 20 })}
            </Text>
          </Group>
        );
      })}
      <Shape geometry={rect(1, 324)} at={[870, 236]} fill={theme.border} />
      <Stack at={[910, 236]} gap={10} motion={enter(span(1.9, 0.6), { from: { opacity: 0, offset: [0, 12] } })}>
        <Text font={mono} size={13} fill={theme.muted}>
          minor allocations
        </Text>
        <Text font={display} size={128} fill={theme.text}>
          {count(track(1).to(7.4, span(2.0, 1.2)), { format: (n) => n.toFixed(1) + "×", rate: 20 })}
        </Text>
        <Text font={sans} size={20} width={290} fill={theme.muted}>
          fewer minor allocations than Angstrom (optimized)
        </Text>
        <Text font={mono} size={16} fill={theme.text}>
          1.5 GB <Run fill={theme.muted}>vs</Run> 11.1 GB
        </Text>
      </Stack>
      <Text font={mono} size={15} at={[80, 144]} fill={theme.muted} motion={enter(span(2.6, 0.5))}>
        JSON array of 10 numbers · 1M parses · bench/bench_json.ml
      </Text>
    </Group>
  );
};

// 6. The rest of the kit.
const FEATURES: readonly { icon: typeof waveSine; title: string; body: TextChild }[] = [
  { icon: waveSine, title: "Streaming", body: [<Id>Source.parse</Id>, " and ", <Id>Push.parse</Id>, ", bounded by ", <Id>~backtrack_window</Id>, "."] },
  { icon: scissors, title: "Zero-copy slices", body: [<Id>Slice.t</Id>, " is zero-copy under ", <Id>Parseff.parse</Id>, "."] },
  { icon: arrowsSplit, title: "Backtracking", body: [<Id>or_</Id>, ", ", <Id>one_of</Id>, ", ", <Id>commit</Id>, ", ", <Id>cut</Id>, "."] },
  { icon: arrowBackUp, title: "Error recovery", body: [<Id>recover</Id>, ", ", <Id>require</Id>, ", ", <Id>list</Id>, "."] },
  { icon: cpu, title: "Domain-safe", body: "Parse state lives per domain." },
  { icon: feather, title: "One dependency", body: ["Depends only on ", <Id>uucp</Id>, "."] },
];

const Features = (): SceneElement => {
  const tiles = span(0.4, 0.5).cascade(FEATURES.length, 0.08);

  return (
    <Group>
      <Heading>Also in the API</Heading>
      <Grid columns={3} gap={24} at={[80, 236]} anchor="top-left">
        {FEATURES.map((f, i) => (
          <Stack
            key={f.title}
            gap={10}
            width={357}
            height={172}
            padding={24}
            radius={8}
            fill={theme.surface}
            stroke={{ color: theme.border, width: 1 }}
            motion={enter(tiles[i]!, { from: { opacity: 0, offset: [0, 20], scale: 0.97 } })}
          >
            <Center width={28} height={28}>
              <Icon icon={f.icon} size={26} color={theme.accent} />
            </Center>
            <Text font={sans} weight={600} size={22} fill={theme.text}>
              {f.title}
            </Text>
            <Text font={sans} size={17} width={300} fill={theme.muted}>
              {f.body}
            </Text>
          </Stack>
        ))}
      </Grid>
    </Group>
  );
};

// 7. End card: the mark, the install line, where to read more.
const Outro = (): SceneElement => {
  const type = span(0.9, 1.1);

  return (
    <Group>
      <Text
        font={display}
        size={132}
        at={[640, 250]}
        anchor="center"
        fill={theme.text}
        motion={enter(span(0.3, 0.6), { from: { opacity: 0, offset: [-20, 0] } })}
      >
        parseff
      </Text>
      <Center
        at={[640, 372]}
        anchor="top"
        padding={[32, 20]}
        radius={8}
        fill={theme.surface}
        stroke={{ color: theme.border, width: 1 }}
        motion={enter(span(0.6, 0.5), { from: { opacity: 0, offset: [0, 12] } })}
      >
        <Text font={mono} size={26} fill={theme.text} clip={(own) => track(rect(1, own.height)).to(rect(own.width, own.height), type, ease.linear)}>
          $ opam install parseff
        </Text>
      </Center>
      <Text
        font={sans}
        size={20}
        at={[640, 486]}
        anchor="top"
        fill={theme.muted}
        motion={enter(span(type.end + 0.2, 0.6), { from: { opacity: 0, offset: [0, 8] } })}
      >
        davesnx.github.io/parseff  ·  github.com/davesnx/parseff
      </Text>
    </Group>
  );
};

const Chrome = ({ when }: { when: Span }): SceneElement => (
  <Sequence when={when}>
    <Group motion={[enter(span(0, FADE)), exit(span(when.over - FADE, FADE))]}>
      <Shape geometry={OCAML} at={[80, 664]} anchor="left" fill="#EE6A1A" />
      <Text font={sans} weight={600} size={17} at={[116, 664]} anchor="left" fill={theme.text}>
        parseff
      </Text>
      {Array.from({ length: 6 }, (_, k) => {
        const on = track(k === 0 ? theme.accent : theme.border);
        const lit = k === 0 ? on : on.to(theme.accent, span(starts[k + 1]! - starts[1]!, FADE));

        return (
          <Shape
            key={"tick" + k}
            geometry={rect(28, 3, { radius: 1.5 })}
            at={[1002 + k * 34, 664]}
            anchor="left"
            fill={k === 5 ? lit : lit.to(theme.border, span(starts[k + 2]! - starts[1]!, FADE))}
          />
        );
      })}
    </Group>
  </Sequence>
);

export default scene(
  {
    size: [W, H],
    duration: starts[7]! + SHOTS[7],
    loop: false,
    title: "Parseff: direct-style parser combinators for OCaml 5",
    desc: "A launch film for Parseff. The wordmark springs in; Angstrom's monadic binds light up red, then dissolve as each bound name slides to the front of its line as plain let-in code, and the card shrinks into the next shot; a cursor parses an IP address while the octet parser's lines light up, and 256 fails with a typed error; a broken statement list first stops at one error, then with diagnostics parses through with holes and two reported errors; two chunks split mid-token feed a push parser; JSON benchmark bars grow; six feature tiles cascade in; the end card shows opam install parseff.",
    theme,
    still: starts[7]! + 4,
  },
  (canvas) => (
    <Group>
      <Shape geometry={canvas.rect} fill={theme.background} />
      <Chrome when={span(starts[1]! - FADE, starts[7]! - starts[1]!)} />
      <Handoff when={span(starts[1]! - FADE, starts[3]! - starts[1]! + FADE)} />
      <Shot when={shot(0)}>
        <Intro />
      </Shot>
      <Shot when={handed(1)} fadeOut={false}>
        <DirectStyle />
      </Shot>
      <Shot when={handed(2)} fadeIn={false}>
        <TypedErrors />
      </Shot>
      <Shot when={shot(3)}>
        <Recovery />
      </Shot>
      <Shot when={shot(4)}>
        <Streaming />
      </Shot>
      <Shot when={shot(5)}>
        <Performance />
      </Shot>
      <Shot when={shot(6)}>
        <Features />
      </Shot>
      <Shot when={shot(7)} fadeOut={false}>
        <Outro />
      </Shot>
    </Group>
  ),
);
