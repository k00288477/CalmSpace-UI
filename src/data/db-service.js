import {db} from './firebase-handler.js'
import {limitToLast, onValue, query, ref, get, orderByChild } from 'firebase/database'

export default class DatabaseService {

    static getLatest(callback) {
        const latestQuery = query(ref(db, 'readings'), limitToLast(1))
        return onValue(latestQuery, (snapshot) => {
            if (snapshot.exists()) {
                const values = Object.values(snapshot.val())
                callback(values[0])
            }
        })
    }

    static async getAllDataRows() {
        const snapshot = await get(ref(db, 'readings'), orderByChild('timestamp'))
        if (snapshot.exists()) {
            return Object.values(snapshot.val().reverse())
        }
        return []
    }

    static pollAll(callback, interval = 1000) {
        const timer = setInterval(async () => {
            const snapshot = await get(ref(db, 'readings'), orderByChild('timestamp'))
            if (snapshot.exists()) {
                callback(Object.values(snapshot.val()).reverse())
            }
        }, interval)
        return () => clearInterval(timer)
    }
}