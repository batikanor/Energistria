#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
from pathlib import Path

os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")

import perth
import soundfile as sf
import torch

if getattr(perth, "PerthImplicitWatermarker", None) is None:
    perth.PerthImplicitWatermarker = perth.DummyWatermarker

from chatterbox.tts import ChatterboxTTS


def choose_device() -> str:
    return "mps" if torch.backends.mps.is_available() else "cpu"


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a Chatterbox TTS WAV from a reference voice.")
    parser.add_argument("--text", required=True)
    parser.add_argument("--reference", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    reference = Path(args.reference)
    output = Path(args.output)
    if not reference.exists():
        raise FileNotFoundError(reference)

    device = choose_device()
    model = ChatterboxTTS.from_pretrained(device=device)
    wav = model.generate(
        args.text,
        audio_prompt_path=str(reference),
        repetition_penalty=1.16,
        min_p=0.045,
        top_p=0.92,
        exaggeration=0.30,
        cfg_weight=0.34,
        temperature=0.64,
    )
    audio = wav.detach().cpu().numpy()
    if audio.ndim == 2:
        audio = audio[0]
    output.parent.mkdir(parents=True, exist_ok=True)
    sf.write(output, audio, int(model.sr))


if __name__ == "__main__":
    main()
