from vital_api.voice import audio_format


def test_audio_format_maps_a_browser_recording():
    assert audio_format("audio/webm;codecs=opus", "question.webm") == "webm"
    assert audio_format("audio/mp4", "question.m4a") == "m4a"
    assert audio_format("audio/wav", "question.wav") == "wav"


def test_audio_format_falls_back_to_webm():
    assert audio_format("", "") == "webm"
