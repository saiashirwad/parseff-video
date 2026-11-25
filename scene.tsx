import { Code } from "@svjeez/code";
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
  moved,
  linear,
  path,
  rect,
  scaled,
  scene,
  span,
  tokens,
  track,
  type Child,
  type SceneElement,
  type Span,
  type Vec,
} from "svjeez";

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

const SHOTS = [4.4, 6.8, 8.4, 8.2, 6.0, 6.0, 4.2, 4.6] as const;
const starts = SHOTS.map((_, i) => SHOTS.slice(0, i).reduce((a, b) => a + b, 0));
const FADE = 0.4;
const shot = (i: number): Span => (i === 0 ? span(0, SHOTS[0]) : span(starts[i]! - FADE, SHOTS[i]! + FADE));

const Shot = ({ when, last, children }: { when: Span; last?: boolean; children: Child }): SceneElement => (
  <Sequence when={when}>
    <Group
      motion={[
        enter(span(0, FADE), { from: { opacity: 0 }, curve: ease.inOut }),
        !last && exit(span(when.over - FADE, FADE), { to: { opacity: 0 }, curve: ease.inOut }),
      ]}
    >
      {children}
    </Group>
  </Sequence>
);

const Heading = ({ n, eyebrow, title }: { n: string; eyebrow: string; title: string }): SceneElement => (
  <Align place="top" inset={52}>
    <Stack gap={18} align="center">
      <Stack direction="row" gap={10} align="center">
        <Shape geometry={circle(4)} fill={theme.accent} />
        <Text font={sans} size={19} fill={theme.muted}>
          {eyebrow}
        </Text>
      </Stack>
      <Text font={sans} weight={600} size={50} fill={theme.text}>
        {title}
      </Text>
    </Stack>
  </Align>
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

// 2. Angstrom's binds light up, then the same parser morphs into plain let ... in.
const ANGSTROM = `let key_value =
  take_while1 (fun c -> c <> ':') >>= fun key ->
  char ':' >>= fun _ ->
  skip_while is_ws >>= fun () ->
  take_while1 (fun c -> c <> '\\n') >>= fun value ->
  return (key, value)`;

const PARSEFF = `let key_value () =
  let k = take_while ~at_least:1 (fun c -> c <> ':') in
  let _ = char ':' in
  skip_whitespace ();
  let v = take_while ~at_least:1 (fun c -> c <> '\\n') in
  (k, v)`;

const DirectStyle = (): SceneElement => {
  const [x, y, w, h] = [200, 220, 880, 290];
  const size = 18;
  const lineH = size * 1.7;
  const codeAt: Vec = [x + 44, y + 76];
  const swap = span(3.3, 1.2);
  const flagged = span(1.3, 0.35).cascade(4, 0.16);
  const binds = ANGSTROM.split("\n").flatMap((text, i) => {
    const col = text.indexOf(">>=");

    return col < 0 ? [] : [{ i, col, len: 3 }];
  });

  return (
    <Group>
      <Heading n="01" eyebrow="Direct style" title="Parsers are plain functions." />
      <Shape
        geometry={rect(w, h, { radius: 10 })}
        at={[x, y]}
        fill={theme.surface}
        stroke={{ color: theme.border, width: 1 }}
      />
      {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((color, i) => (
        <Shape key={"dot" + i} geometry={circle(6)} at={[x + 26 + i * 20, y + 24]} anchor="center" fill={color} />
      ))}
      <Shape geometry={rect(w - 2, 1)} at={[x + 1, y + 48]} fill={theme.border} />
      <Text font={mono} size={14} at={[W / 2, y + 24]} anchor="center" fill={theme.muted} opacity={track(1).to(0, swap)}>
        angstrom.ml
      </Text>
      <Text font={mono} size={14} at={[W / 2, y + 24]} anchor="center" fill={theme.muted} opacity={track(0).to(1, swap)}>
        parseff.ml
      </Text>
      <Text
        font={mono}
        size={14}
        at={[x + w - 24, y + 24]}
        anchor="right"
        fill={track(theme.red).to(theme.green, swap)}
      >
        {count(track(4).to(0, swap, ease.inOut))} binds
      </Text>
      {binds.map(({ i, col, len }, n) => (
        <Shape
          key={"bind" + i}
          geometry={rect(len * cw(size) + 6, lineH * 0.78)}
          at={[codeAt[0] + col * cw(size) - 3, codeAt[1] + i * lineH - 1]}
          fill={alpha(theme.red, 0.22)}
          motion={[
            enter(flagged[n]!, { from: { opacity: 0, scale: 0.9 }, curve: ease.pop }),
            exit(span(swap.start - 0.25, 0.3), { to: { opacity: 0 } }),
          ]}
        />
      ))}
      {ANGSTROM.split("\n").map((_, i) => {
        const turn = span(swap.start + i * 0.16, 0.25);
        const only = moved(rect(w, lineH), [-40, i * lineH - 6]);

        return (
          <Group key={"line" + i}>
            <Code
              lang="ocaml"
              grammars={[ocaml]}
              font={mono}
              size={size}
              lineHeight={1.7}
              palette={palette}
              at={codeAt}
              clip={only}
              motion={exit(turn, { to: { opacity: 0, offset: [0, -10] }, curve: ease.in })}
            >
              {ANGSTROM}
            </Code>
            <Code
              lang="ocaml"
              grammars={[ocaml]}
              font={mono}
              size={size}
              lineHeight={1.7}
              palette={palette}
              at={codeAt}
              clip={only}
              motion={enter(turn.next(0.3), { from: { opacity: 0, offset: [0, 10] } })}
            >
              {PARSEFF}
            </Code>
          </Group>
        );
      })}
      <Text
        font={sans}
        size={22}
        at={[W / 2, y + h + 44]}
        anchor="top"
        fill={theme.muted}
        motion={enter(span(4.6, 0.6), { from: { opacity: 0, offset: [0, 10] } })}
      >
        Sequencing is <Run font={mono} fill={theme.text}>let … in</Run>. Each parser is a{" "}
        <Run font={mono} fill={theme.text}>unit -&gt; 'a</Run> function.
      </Text>
    </Group>
  );
};

// 3. The octet parser on the left; on the right a cursor walks an IP address and the last octet fails with a typed error.
const OCTET = "type Parseff.custom_error += Out_of_range of int\n\nlet octet () =\n  let n = Parseff.integer () in\n  if n > 255 then Parseff.error (Out_of_range n)\n  else n";

const TypedErrors = (): SceneElement => {
  const [cx, cy, cwid, chei] = [100, 220, 540, 236];
  const cs = 14;
  const cl = cs * 1.8;
  const codeAt: Vec = [cx + 28, cy + 70];
  const size = 52;
  const c = cw(size);
  const input = "192.168.1.256";
  const mid = 930;
  const x0 = mid - (input.length * c) / 2;
  const ty = 226;
  const octets = [
    { from: 0, to: 3, label: "192" },
    { from: 4, to: 7, label: "168" },
    { from: 8, to: 9, label: "1" },
    { from: 10, to: 13, label: "256 > 255" },
  ];
  const moves = span(0.9, 0.6).cascade(4, 1.4);
  const fail = span(moves[3].end, 0.3);
  const by = ty + 84;
  const line = (n: number) => codeAt[1] + n * cl - 5;

  return (
    <Group>
      <Heading n="02" eyebrow="Typed errors" title="Errors you can pattern match." />
      <Shape geometry={rect(cwid, chei, { radius: 10 })} at={[cx, cy]} fill={theme.surface} stroke={{ color: theme.border, width: 1 }} />
      {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((color, i) => (
        <Shape key={"dot" + i} geometry={circle(6)} at={[cx + 26 + i * 20, cy + 24]} anchor="center" fill={color} />
      ))}
      <Shape geometry={rect(cwid - 2, 1)} at={[cx + 1, cy + 48]} fill={theme.border} />
      <Text font={mono} size={13} at={[cx + cwid / 2, cy + 24]} anchor="center" fill={theme.muted}>
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
      <Code lang="ocaml"
        grammars={[ocaml]} font={mono} size={cs} lineHeight={1.8} palette={palette} at={codeAt}>
        {OCTET}
      </Code>
      <Text font={mono} size={size} at={[x0, ty]} fill={theme.text}>
        192.168.1.<Run fill={track(theme.text).to(theme.red, fail)}>256</Run>
      </Text>
      <Shape
        geometry={rect(3, 70)}
        at={octets.reduce(
          (t, o, i) => t.to([x0 + o.to * c + 2, ty - 2], moves[i]!, ease.inOut),
          track<Vec>([x0 - 6, ty - 2]),
        )}
        fill={track(theme.accent).to(theme.red, fail)}
        motion={enter(span(0.6, 0.3))}
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
        at={[mid, 378]}
        anchor="top"
        width={500}
        gap={8}
        padding={[22, 16]}
        fill={alpha(theme.red, 0.1)}
        motion={enter(span(fail.end + 0.2, 0.5), { from: { opacity: 0, offset: [0, 14] } })}
      >
        <Text font={mono} size={15} fill={theme.red}>
          Error
        </Text>
        <Text font={mono} size={15} fill={theme.text}>
          {"{ kind = Custom (Out_of_range 256); _ }"}
        </Text>
      </Stack>
      <Text
        font={sans}
        size={17}
        at={[mid, 480]}
        anchor="top"
        width={500}
        align="center"
        fill={theme.muted}
        motion={enter(span(fail.end + 0.6, 0.5), { from: { opacity: 0, offset: [0, 8] } })}
      >
        Custom errors are OCaml variants you match on.
      </Text>
    </Group>
  );
};

// 4. One pass over broken input: holes where it fails, every error reported.
const Recovery = (): SceneElement => {
  const size = 30;
  const c = cw(size);
  const input = "let x = 1; let y = ; let z = 3; let = 4;";
  const x0 = (W - input.length * c) / 2;
  const ty = 240;
  const by = ty + 52;
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
  const ds = 16;

  return (
    <Group>
      <Heading n="03" eyebrow="Error recovery" title="Recover from errors and keep parsing." />
      {stmts.map((s, i) =>
        s.ok ? null : (
          <Shape
            key={"bad" + i}
            geometry={rect(c, 40, { radius: 4 })}
            at={[x0 + (s.at ?? 0) * c, ty - 1]}
            fill={alpha(theme.red, 0.28)}
            motion={enter(i === 1 ? span(stop.end - 0.05, 0.25) : span(moves[i]!.end - 0.05, 0.25))}
          />
        ),
      )}
      {modes.map((m) => (
        <Text key={m.text} font={mono} size={15} at={[x0, ty - 40]} fill={theme.muted} opacity={m.opacity}>
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
        at={[W / 2, by + 36]}
        anchor="top"
        padding={[18, 10]}
        radius={6}
        fill={alpha(theme.red, 0.1)}
        motion={[enter(span(stop.end + 0.15, 0.35), { from: { opacity: 0, offset: [0, 8] } }), exit(span(reset - 0.4, 0.3))]}
      >
        <Text font={mono} size={16} fill={theme.text}>
          <Run fill={theme.muted}>1:20:</Run> <Run fill={theme.red}>[error]</Run> expected integer, found ';'
        </Text>
        <Text font={sans} size={17} fill={theme.muted}>
          Without diagnostics, parsing stops here.
        </Text>
      </Stack>
      <Shape
        geometry={rect(2, 44, { radius: 1 })}
        at={stmts.reduce(
          (t, s, i) => t.to([x0 + s.to * c, ty - 3], moves[i]!, ease.inOut),
          track<Vec>([x0 - 4, ty - 3])
            .to([x0 + 10 * c, ty - 3], span(0.7, 0.42), ease.inOut)
            .to([x0 + 19 * c, ty - 3], stop, ease.inOut)
            .set([x0 - 4, ty - 3], span(reset)),
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
              <Text font={mono} size={15} fill={color}>
                {s.node}
              </Text>
            </Center>
          </Group>
        );
      })}
      <Stack
        at={[W / 2, 420]}
        anchor="top"
        width={Math.round(input.length * c) + 56}
        gap={8}
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
              <Text font={mono} size={ds} at={[0, ds * 1.4]} fill={theme.muted}>
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
  const [cx, cy, cwid, chei] = [100, 220, 540, 304];
  const cs = 15;
  const cl = cs * 1.8;
  const codeAt: Vec = [cx + 28, cy + 70];
  const line = (n: number) => codeAt[1] + n * cl - 5;
  const [tx, ty, tw, th] = [680, 246, 500, 76];
  const arrive = span(1.0, 0.7).cascade(2, 1.6);
  const chunks = [
    { text: '"ab"', x: tx + 18 },
    { text: '"c\\nd"', x: tx + 18 + cw(20) * 4 + 28 + 12 },
  ];

  return (
    <Group>
      <Heading n="04" eyebrow="Streaming" title="Parse input as it arrives." />
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
      <Text font={mono} size={13} at={[tx, cy]} fill={theme.muted}>
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
        size={20}
        at={[tx + tw / 2, ty + th + 34]}
        anchor="top"
        fill={theme.muted}
        motion={[enter(span(arrive[0].end, 0.3)), exit(span(arrive[1].start + 0.3, 0.25))]}
      >
        Await
      </Text>
      <Text
        font={mono}
        size={20}
        at={[tx + tw / 2, ty + th + 34]}
        anchor="top"
        fill={theme.green}
        motion={enter(span(arrive[1].end + 0.1, 0.4), { from: { opacity: 0, offset: [0, 8] } })}
      >
        {'Done (Ok ("abc", "d"))'}
      </Text>
      <Text
        font={sans}
        size={17}
        at={[tx + tw / 2, ty + th + 96]}
        anchor="top"
        width={tw}
        align="center"
        fill={theme.muted}
        motion={enter(span(arrive[1].end + 0.7, 0.5), { from: { opacity: 0, offset: [0, 8] } })}
      >
        Chunks can split a token. The parser is unchanged.
      </Text>
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
  const [bx, top, rowH, maxW] = [316, 250, 70, 420];

  return (
    <Group>
      <Heading n="04" eyebrow="Performance" title="Faster than Angstrom on JSON." />
      <Text font={mono} size={13} at={[100, top - 34]} fill={theme.muted}>
        json parses per second
      </Text>
      {rows.map((r, i) => {
        const y = top + i * rowH;

        return (
          <Group key={"row" + i}>
            <Text font={sans} size={20} at={[100, y + 15]} anchor="left" fill={theme.text}>
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
      <Shape geometry={rect(1, 280)} at={[880, top - 30]} fill={theme.border} />
      <Stack at={[930, top - 34]} gap={10} motion={enter(span(1.9, 0.6), { from: { opacity: 0, offset: [0, 12] } })}>
        <Text font={mono} size={13} fill={theme.muted}>
          minor allocations
        </Text>
        <Text font={display} size={96} fill={theme.text}>
          {count(track(1).to(7.4, span(2.0, 1.2)), { format: (n) => n.toFixed(1) + "×", rate: 20 })}
        </Text>
        <Text font={sans} size={20} width={250} fill={theme.muted}>
          fewer minor allocations than Angstrom (optimized)
        </Text>
        <Text font={mono} size={16} fill={theme.text}>
          1.5 GB <Run fill={theme.muted}>vs</Run> 11.1 GB
        </Text>
      </Stack>
      <Text font={mono} size={13} at={[W / 2, 620]} anchor="top" fill={theme.muted} motion={enter(span(2.6, 0.5))}>
        JSON array of 10 numbers · 1M parses · bench/bench_json.ml
      </Text>
    </Group>
  );
};

// 6. The rest of the kit.
const FEATURES = [
  { icon: waveSine, title: "Streaming", body: "Pull and push sources with bounded backtracking." },
  { icon: scissors, title: "Zero-copy slices", body: "Slice.t and fused scanners for hot paths." },
  { icon: arrowsSplit, title: "Backtracking", body: "or_ and one_of, sealed with commit and cut." },
  { icon: arrowBackUp, title: "Error recovery", body: "recover, require and list continue after errors." },
  { icon: cpu, title: "Domain-safe", body: "Parse in parallel across OCaml 5 domains." },
  { icon: feather, title: "One dependency", body: "Just uucp, for Unicode properties." },
];

const Features = (): SceneElement => {
  const tiles = span(0.4, 0.5).cascade(FEATURES.length, 0.08);

  return (
    <Group>
      <Heading n="05" eyebrow="Features" title="Also included" />
      <Grid columns={3} gap={24} at={[W / 2, 220]} anchor="top">
        {FEATURES.map((f, i) => (
          <Stack
            key={f.title}
            gap={10}
            width={344}
            height={168}
            padding={24}
            radius={8}
            fill={theme.surface}
            stroke={{ color: theme.border, width: 1 }}
            motion={enter(tiles[i]!, { from: { opacity: 0, offset: [0, 20], scale: 0.97 } })}
          >
            <Icon icon={f.icon} size={26} color={theme.accent} />
            <Text font={sans} weight={600} size={21} fill={theme.text}>
              {f.title}
            </Text>
            <Text font={sans} size={16} width={290} fill={theme.muted}>
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
  const cy = 270;
  const type = span(0.9, 1.1);

  return (
    <Group>
      <Text
        font={display}
        size={72}
        at={[W / 2, cy]}
        anchor="center"
        fill={theme.text}
        motion={enter(span(0.3, 0.6), { from: { opacity: 0, offset: [-20, 0] } })}
      >
        parseff
      </Text>
      <Center
        at={[W / 2, 370]}
        anchor="top"
        padding={[28, 18]}
        radius={8}
        fill={theme.surface}
        stroke={{ color: theme.border, width: 1 }}
        motion={enter(span(0.6, 0.5), { from: { opacity: 0, offset: [0, 12] } })}
      >
        <Text font={mono} size={22} fill={theme.text} clip={(own) => track(rect(1, own.height)).to(rect(own.width, own.height), type, ease.linear)}>
          $ opam install parseff
        </Text>
      </Center>
      <Text
        font={sans}
        size={20}
        at={[W / 2, 470]}
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
    <Shape
      geometry={OCAML}
      at={[W - 100, 64]}
      anchor="right"
      fill="#EE6A1A"
      motion={[enter(span(0, 0.6)), exit(span(when.over - 0.5, 0.5))]}
    />
  </Sequence>
);

export default scene(
  {
    size: [W, H],
    duration: starts[7]! + SHOTS[7],
    loop: false,
    title: "Parseff: direct-style parser combinators for OCaml 5",
    desc: "A launch film for Parseff. The wordmark springs in; Angstrom's monadic binds are wiped into plain let-in code; a cursor parses an IP address while the octet parser's lines light up, and 256 fails with a typed error; a broken statement list first stops at one error, then with diagnostics parses through with holes and two reported errors; two chunks split mid-token feed a push parser; JSON benchmark bars grow; six feature tiles cascade in; the end card shows opam install parseff.",
    theme,
    still: starts[7]! + 4,
  },
  (canvas) => (
    <Group>
      <Shape geometry={canvas.rect} fill={theme.background} />
      <Chrome when={span(starts[1]!, starts[7]! - starts[1]!)} />
      <Shot when={shot(0)}>
        <Intro />
      </Shot>
      <Shot when={shot(1)}>
        <DirectStyle />
      </Shot>
      <Shot when={shot(2)}>
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
      <Shot when={shot(7)} last>
        <Outro />
      </Shot>
    </Group>
  ),
);
