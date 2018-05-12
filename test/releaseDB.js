/**
 * @author              Piper Merriam  - originally written in Python for ethpm/escape
 * @translation-to-js   cgewecke
 */

const helpers = require('./helpers');
const constants = helpers.constants;

const PackageDB = artifacts.require('PackageDB');
const ReleaseDB = artifacts.require('ReleaseDB');

contract('ReleaseDB', function(accounts){
  let packageDB;
  let releaseDB;
  let nameHash;

  const v100 = ['test', 1, 0, 0, '', '']
  const v110b1 = ['test', 1, 1, 0, 'beta.1', '']
  const v110 = ['test', 1, 1, 0, '', '']
  const v101 = ['test', 1, 0, 1, '', '']
  const v200 = ['test', 2, 0, 0, '', '']
  const v123 = ['test', 1, 2, 3, '', '']
  const v124a1bz = ['test', 1, 2, 4, 'alpha.1', 'build.z']
  const v124a1ba = ['test', 1, 2, 4, 'alpha.1', 'build.a']
  const v124a2ba = ['test', 1, 2, 4, 'alpha.2', 'build.a']
  const v124a10ba = ['test', 1, 2, 4, 'alpha.10', 'build.a']
  const v124b1ba = ['test', 1, 2, 4, 'beta.1', 'build.a']
  const v124 = ['test', 1, 2, 4, '', '']

  const versions = [
    v100,
    v110b1,
    v110,
    v101,
    v200,
    v123,
    v124a1bz,
    v124a1ba,
    v124a2ba,
    v124a10ba,
    v124b1ba,
    v124,
  ];

  // Version hashes
  let v100vh;
  let v110b1vh;
  let v110vh;
  let v101vh;
  let v200vh;
  let v123vh;
  let v124a1bzvh;
  let v124a1bavh;
  let v124a2bavh;
  let v124a10bavh;
  let v124b1bavh;
  let v124vh;

  // Release hashes
  let v100h;
  let v110b1h
  let v110h;
  let v101h;
  let v200h;
  let v123h;
  let v124a1bzh;
  let v124a1bah;
  let v124a2bah;
  let v124a10bah;
  let v124b1bah;
  let v124h;

  before(async() => {
    releaseDB = await ReleaseDB.new();
    packageDB = await PackageDB.new();
    nameHash = await packageDB.hashName('test');

    for (let version of versions){
      await releaseDB.setVersion(...version.slice(1));
    }

    v100vh = await releaseDB.hashVersion(...v100.slice(1))
    v110b1vh = await releaseDB.hashVersion(...v110b1.slice(1))
    v110vh = await releaseDB.hashVersion(...v110.slice(1))
    v101vh = await releaseDB.hashVersion(...v101.slice(1))
    v200vh = await releaseDB.hashVersion(...v200.slice(1))
    v123vh = await releaseDB.hashVersion(...v123.slice(1))
    v124a1bzvh = await releaseDB.hashVersion(...v124a1bz.slice(1))
    v124a1bavh = await releaseDB.hashVersion(...v124a1ba.slice(1))
    v124a2bavh = await releaseDB.hashVersion(...v124a2ba.slice(1))
    v124a10bavh = await releaseDB.hashVersion(...v124a10ba.slice(1))
    v124b1bavh = await releaseDB.hashVersion(...v124b1ba.slice(1))
    v124vh = await releaseDB.hashVersion(...v124.slice(1))

    v100h = await releaseDB.hashRelease(nameHash, v100vh)
    v110b1h = await releaseDB.hashRelease(nameHash, v110b1vh)
    v110h = await releaseDB.hashRelease(nameHash, v110vh)
    v101h = await releaseDB.hashRelease(nameHash, v101vh)
    v200h = await releaseDB.hashRelease(nameHash, v200vh)
    v123h = await releaseDB.hashRelease(nameHash, v123vh)
    v124a1bzh = await releaseDB.hashRelease(nameHash, v124a1bzvh)
    v124a1bah = await releaseDB.hashRelease(nameHash, v124a1bavh)
    v124a2bah = await releaseDB.hashRelease(nameHash, v124a2bavh)
    v124a10bah = await releaseDB.hashRelease(nameHash, v124a10bavh)
    v124b1bah = await releaseDB.hashRelease(nameHash, v124b1bavh)
    v124h = await releaseDB.hashRelease(nameHash, v124vh)
  });

  describe('Releases: Version Tracking', function(){
    it('v100vh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v100vh,
        'ipfs://some-ipfs-uri-a'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '1' )
      assert( await releaseDB.getLatestMajorTree(nameHash) === v100h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v100h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
    });

    it('v110b1vh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v110b1vh,
        'ipfs://some-ipfs-uri-c'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '2' )
    })

    it('v110vh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v110vh,
        'ipfs://some-ipfs-uri-b'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '3' )
      assert( await releaseDB.getLatestMajorTree(nameHash) === v110h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v100h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
    });

    it('v101vh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v101vh,
        'ipfs://some-ipfs-uri-c'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '4' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v110h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v110h  )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
    });

    it('v200vh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v200vh,
        'ipfs://some-ipfs-uri-d'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '5' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v110h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    });

    it('v123vh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v123vh,
        'ipfs://some-ipfs-uri-e'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '6' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v123h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 2) === v123h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 3) === v123h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    });

    it('v124a1bzvh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v124a1bzvh,
        'ipfs://some-ipfs-uri-f'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '7' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v124a1bzh )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 2) === v124a1bzh )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 3) === v123h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 4) === v124a1bzh )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    });

    it('v124a1bavh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v124a1bavh,
        'ipfs://some-ipfs-uri-g'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '8' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v124a1bah )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 2) === v124a1bah )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 3) === v123h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 4) === v124a1bah )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    })

    it('v124a2bavh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v124a2bavh,
        'ipfs://some-ipfs-uri-g'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '9' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v124a2bah )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 2) === v124a2bah )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 3) === v123h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 4) === v124a2bah )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    });

    it('v124a10bavh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v124a10bavh,
        'ipfs://some-ipfs-uri-h'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '10' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v124a10bah )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 2) === v124a10bah )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 3) === v123h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 4) === v124a10bah )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    });

    it('v124b1bavh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v124b1bavh,
        'ipfs://some-ipfs-uri-h'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '11' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v124b1bah )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 2) === v124b1bah )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 3) === v123h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 4) === v124b1bah )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    });

    it('v124vh', async function(){
      await releaseDB.setRelease(
        nameHash,
        v124vh,
        'ipfs://some-ipfs-uri-h'
      );

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '12' )

      assert( await releaseDB.getLatestMajorTree(nameHash) === v200h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 1) === v124h )
      assert( await releaseDB.getLatestMinorTree(nameHash, 2) === v200h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 0) === v101h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 2) === v124h )
      assert( await releaseDB.getLatestPatchTree(nameHash, 2, 0) === v200h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 0) === v100h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 0, 1) === v101h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 3) === v123h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 2, 4) === v124h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 2, 0, 0) === v200h )
    });
  });

  describe('Removals', function(){
    it('removes a release', async function(){
      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '12' )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110h )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110h )

      await releaseDB.removeRelease(v110h, 'testing');

      assert( await releaseDB.getNumReleasesForNameHash(nameHash) === '11' )
      assert( await releaseDB.releaseExists(v110h) === false )
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === constants.zeroBytes32 )
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === constants.zeroBytes32 )
    });

    it('updates the tree', async function(){
      const numReleases = await releaseDB.getNumReleasesForNameHash(nameHash);

      for (let i = 0; i < numReleases; i++){
        const rh = await releaseDB.getReleaseHashForNameHash(nameHash, i)
        assert( await releaseDB.releaseExists(rh) );
        await releaseDB.updateLatestTree(rh);
      }

      const val = await releaseDB.getLatestPatchTree(nameHash, 1, 1);
      assert( await releaseDB.getLatestPatchTree(nameHash, 1, 1) === v110b1h );
      assert( await releaseDB.getLatestPreReleaseTree(nameHash, 1, 1, 0) === v110b1h );
    });
  });

  describe('Getters', function(){
    let nameHash;
    let versionHash;
    let releaseHash;
    let owner = accounts[1];

    before(async () => {
      nameHash = await packageDB.hashName('test-getters')
      versionHash = await releaseDB.hashVersion(1, 2, 3, 'beta.1', 'build.abcd1234')
      releaseHash = await releaseDB.hashRelease(nameHash, versionHash);

      await releaseDB.setVersion(1, 2, 3, 'beta.1', 'build.abcd1234');
    });

    it('has correct values', async function(){
      await releaseDB.setVersion(1, 2, 3, 'beta.1', 'build.abcd1234');
      assert(await releaseDB.releaseExists(releaseHash) === false );

      const now = await helpers.now();

      await releaseDB.setRelease(
          nameHash,
          versionHash,
          'ipfs://some-ipfs-uri'
      );

      assert( await releaseDB.releaseExists(releaseHash) === true )

      const releaseData = await releaseDB.getReleaseData(releaseHash);

      assert( releaseData.nameHash  === nameHash )
      assert( releaseData.versionHash === versionHash )
      assert( releaseData.createdAt >= now )
      assert( releaseData.updatedAt >= now )

      assert( await releaseDB.getPreRelease(releaseHash) === 'beta.1' )
      assert( await releaseDB.getBuild(releaseHash) === 'build.abcd1234' )
      assert( await releaseDB.getReleaseLockfileURI(releaseHash) == 'ipfs://some-ipfs-uri' )

      const majorMinorPatch = await releaseDB.getMajorMinorPatch(versionHash);

      assert( majorMinorPatch['0'] === (1).toString());
      assert( majorMinorPatch['1'] === (2).toString());
      assert( majorMinorPatch['2'] === (3).toString());
    });
  })
});
