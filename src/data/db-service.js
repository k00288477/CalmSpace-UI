import {db} from './firebase-handler.js'
import {get, limitToLast, onValue, orderByChild, query, ref} from 'firebase/database'

export default class DatabaseService {

    static getLatest(callback) {
        const latestQuery = query(ref(db, 'readings'), limitToLast(1))
        return onValue(latestQuery, (snapshot) => {
            if (snapshot.exists()) {
                const values = Object.values(snapshot.val())
                console.log('Raw record:', values[0])
                callback(values[0])
            }
        })
    }

    static async getAllDataRows() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000)
        const snapshot = await get(query(ref(db, 'readings'), orderByChild('timestamp')))
        if (snapshot.exists()) {
            return Object.values(snapshot.val())
                .filter(r => r.timestamp >= oneHourAgo)
                .reverse()
        }
        return []
    }

    static subscribeAll(callback) {
        const dbRef = ref(db, 'readings')
        return onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const oneHourAgo = Date.now() - (60 * 60 * 1000)
                const rows = Object.values(snapshot.val())
                    .filter(r => r.timestamp >= oneHourAgo)
                    .reverse()
                callback(rows)
            } else {
                callback([])
            }
        })
    }
}