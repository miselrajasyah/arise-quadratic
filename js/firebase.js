const V = '13.3.0';
const CDN = `https://www.gstatic.com/firebasejs/${V}/`;

const firebaseConfig = {
  apiKey: 'AIzaSyDYxWdTn1wUk4NeLqIgB5msFmG1FbwJ-xk',
  authDomain: 'quadratic-dungeon-arise.firebaseapp.com',
  projectId: 'quadratic-dungeon-arise',
  storageBucket: 'quadratic-dungeon-arise.firebasestorage.app',
  messagingSenderId: '396577237026',
  appId: '1:396577237026:web:b58192e7a6ed16e21c827b',
};

const nameKey = (n) =>
  'n~' +
  encodeURIComponent(
    String(n || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' '),
  ).replace(/\./g, '%2E');

try {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(CDN + 'firebase-app.js'),
    import(CDN + 'firebase-auth.js'),
    import(CDN + 'firebase-firestore.js'),
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  auth.languageCode = 'id';

  let db;
  try {
    db = F.initializeFirestore(app, {
      localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }),
    });
  } catch (_) {
    db = F.getFirestore(app);
  }
  const { doc, getDoc, setDoc, getDocs, collection, query, where, onSnapshot, writeBatch, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp } = F;

  const FB = {
    auth,
    db,
    nameKey,
    onAuth: (cb) => A.onAuthStateChanged(auth, cb),
    current: () => auth.currentUser,

    async nameFree(name) {
      const s = await getDoc(doc(db, 'names', nameKey(name)));
      return !s.exists();
    },

    async register({ email, password, profile, teacherCode }) {
      const cred = await A.createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      try {
        const b = writeBatch(db);
        b.set(doc(db, 'names', nameKey(profile.name)), { uid: user.uid });
        const full = Object.assign({}, profile, {
          uid: user.uid,
          email,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        if (profile.role === 'teacher') full.teacherCode = teacherCode || '';
        b.set(doc(db, 'users', user.uid), full);
        if (profile.role === 'student')
          b.set(doc(db, 'leaderboard', user.uid), FB.slim(full));
        await b.commit();
      } catch (e) {

        try {
          await A.deleteUser(user);
        } catch (_) {}
        throw e;
      }
      try {
        await A.updateProfile(user, { displayName: profile.name });
      } catch (_) {}
      let mailed = true;
      try {
        await A.sendEmailVerification(user);
      } catch (_) {
        mailed = false;
      }
      return { user, mailed };
    },

    login: (email, password) => A.signInWithEmailAndPassword(auth, email, password),
    logout: () => A.signOut(auth),
    sendVerification: () => A.sendEmailVerification(auth.currentUser),
    resetPassword: (email) => A.sendPasswordResetEmail(auth, email),

    async refreshUser() {
      if (!auth.currentUser) return null;
      await A.reload(auth.currentUser);
      return auth.currentUser;
    },

    slim: (u) => ({
      uid: u.uid,
      name: u.name,
      role: u.role,
      rank: u.rank || 'E',
      xp: u.xp || 0,
      title: u.title || '',
      done: u.done || {},
      raid: u.raid || null,
      bonus: u.bonus || 0,
      cls: u.cls || '',
      streak: u.streak || 1,

      gear: u.gear || null,
      stat: u.stat || null,
      updatedAt: Date.now(),
    }),

    async getMe(uid) {
      const s = await getDoc(doc(db, 'users', uid));
      return s.exists() ? s.data() : null;
    },

    async putMe(uid, full, slim) {
      const b = writeBatch(db);
      b.set(doc(db, 'users', uid), full);
      if (slim) b.set(doc(db, 'leaderboard', uid), slim);
      await b.commit();
    },

    async createProfile(uid, full, teacherCode) {
      const b = writeBatch(db);
      b.set(doc(db, 'names', nameKey(full.name)), { uid });
      const f = Object.assign({}, full);
      if (f.role === 'teacher') f.teacherCode = teacherCode || '';
      b.set(doc(db, 'users', uid), f);
      if (f.role === 'student') b.set(doc(db, 'leaderboard', uid), FB.slim(f));
      await b.commit();
    },

    watchMe: (uid, cb, err) =>
      onSnapshot(doc(db, 'users', uid), { includeMetadataChanges: false }, (s) => cb(s), err),

    async listStudentsFull() {
      const s = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      return s.docs.map((d) => d.data());
    },
    async listLeaderboard() {
      const s = await getDocs(collection(db, 'leaderboard'));
      return s.docs.map((d) => d.data());
    },

    watchCol: (name, cb, err) =>
      onSnapshot(
        collection(db, name),
        (s) => cb(s.docs.map((d) => Object.assign({}, d.data(), { _id: d.id }))),
        err,
      ),
    watchDoc: (name, id, cb, err) => onSnapshot(doc(db, name, id), (s) => cb(s.exists() ? s.data() : null), err),
    setIn: (name, id, data) => setDoc(doc(db, name, id), data),
    updateIn: (name, id, data) => updateDoc(doc(db, name, id), data),

    arrIn: (name, id, field, val, add) =>
      updateDoc(doc(db, name, id), { [field]: add ? arrayUnion(val) : arrayRemove(val) }),
    delIn: (name, id) => deleteDoc(doc(db, name, id)),

    async delMany(list) {
      const b = writeBatch(db);
      list.forEach(([c, i]) => b.delete(doc(db, c, i)));
      await b.commit();
    },

    watchHits: (bid, cb, err) =>
      onSnapshot(
        collection(db, 'worldBoss', bid, 'hits'),
        (s) =>
          cb(
            s.docs.map((d) => {
              const x = d.data({ serverTimestamps: 'estimate' });
              return Object.assign({}, x, { _id: d.id, _t: x.t && x.t.toMillis ? x.t.toMillis() : Date.now() });
            }),
          ),
        err,
      ),

    addHit: (bid, id, data) => setDoc(doc(db, 'worldBoss', bid, 'hits', id), Object.assign({}, data, { t: serverTimestamp() })),

    async delBoss(bid) {
      const s = await getDocs(collection(db, 'worldBoss', bid, 'hits'));
      for (let i = 0; i < s.docs.length; i += 400) {
        const b = writeBatch(db);
        s.docs.slice(i, i + 400).forEach((d) => b.delete(d.ref));
        await b.commit();
      }
      await deleteDoc(doc(db, 'worldBoss', bid));
    },

    async setBest(offIds, onId) {
      const b = writeBatch(db);
      offIds.forEach((i) => b.update(doc(db, 'forumReplies', i), { best: false }));
      if (onId) b.update(doc(db, 'forumReplies', onId), { best: true });
      await b.commit();
    },
  };
  window.FB = FB;
  document.dispatchEvent(new Event('fb-ready'));
} catch (e) {
  console.warn('Firebase gagal dimuat:', e);
  window.FB = null;
  document.dispatchEvent(new Event('fb-fail'));
}
