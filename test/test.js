import test from 'ava'

const v = 3;

test('startup', (t) => {
    t.plan(1)

    t.is(v, 3)
})

// exclude via glob
// no bower file
// no version specified
// should work with valid both .bower & bower.json