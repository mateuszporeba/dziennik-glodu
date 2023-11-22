const checkUsersDatabase = (userId) => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()


  const ThisMonthDatabaseRef = ref(database, 'users/' + userId + '/dziennik-glodu/' + year + '/' + month);

  const timestamp = new Date().getTime()

  onValue(ThisMonthDatabaseRef, (snapshot) => {
    const data = snapshot.exists()
    console.log('BEFORE IF: checkUsersDatabase')
    if (!data) {
      console.log('checkUsersDatabase')
      set(ref(database, 'users/' + userId + '/dziennik-glodu/' + + year + '/' + month), {
        table: { 0: Array.from({ length: 22 }, () => 0) },
      })
      // Create a new id reference
      set(ref(database, 'users/' + userId + '/dg-id/' + + year + '/' + month), {
        ts: timestamp,
      })
    }
  })
}
export default checkUsersDatabase