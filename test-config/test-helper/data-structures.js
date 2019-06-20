const outdatedPackage = {
  packageName: 'my-package-name',
  versions: {
    current: '2.3.4',
    latest: '3.4.5'
  }
};

const outdatedInformation = {
  packageName: 'my-package-name',
  versions: {
    current: '2.3.4',
    latest: '3.4.5',
    history: [
      { version: '2.3.4', releaseDate: '2018-03-02T00:00:00' }
    ]
  },
  usefulLinks: [
    { name: 'Repository', link: 'https://...' }
  ]
};


const decisionResult = {
  packageName: 'my-package-name',
  versions: {
    current: '2.3.4',
    latest: '3.4.5',
    history: [
      { version: '2.3.4', releaseDate: '2018-03-02T00:00:00' }
    ]
  },
  usefulLinks: [
    { name: 'Repository', link: 'https://...' }
  ],
  update: true
};
