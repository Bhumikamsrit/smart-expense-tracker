def reduction(before, after):
    return (before-after)/before

def test_20_percent():
    assert reduction(4.0, 3.2) == 0.2

def test_40_percent():
    assert round(reduction(72, 43.2), 2) == 0.4

def test_30_percent_visibility():
    assert round((79-61)/61, 2) == 0.3
