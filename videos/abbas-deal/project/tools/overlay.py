import json, subprocess, sys
proj, src = sys.argv[1], sys.argv[2]
ov = json.load(open(f'{proj}/overlays.json'))
n = len(ov); f = []
f.append(f'[1:v]split={n}' + ''.join(f'[s{i}]' for i in range(n)))
f.append(f'[2:v]format=gray,split={n}' + ''.join(f'[m{i}]' for i in range(n)))
last = '0:v'
for i, o in enumerate(ov):
    s, e = o['s'], o['e']
    f.append(f"[s{i}]trim=start={s}:end={e + 0.1},setpts=PTS-STARTPTS+{s}/TB,crop=1024:390:0:80,scale=900:343,format=rgba[c{i}]")
    f.append(f"[c{i}][m{i}]alphamerge[a{i}]")
    f.append(f"[{last}][a{i}]overlay=x=90:y=640:enable='between(t,{s},{e})':eof_action=pass:format=auto[v{i}]")
    last = f'v{i}'
cmd = ['ffmpeg', '-v', 'error', '-y', '-i', f'{proj}/renders/video.mp4', '-i', src, '-loop', '1', '-framerate', '60', '-i', f'{proj}/assets/mask.png',
       '-filter_complex', ';'.join(f), '-map', f'[{last}]', '-t', '30', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', '60', '-movflags', '+faststart', f'{proj}/renders/video_ov.mp4']
subprocess.run(cmd, check=True); print('ok')
