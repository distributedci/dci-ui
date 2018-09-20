%global debug_package %{nil}

Name:           dci-ui
Version:        0.1.1
Release:        1.VERS%{?dist}

Summary:        DCI UI static files
License:        ASL 2.0

URL:            https://github.com/redhat-cip/dci-ui
Source0:        dci-ui-%{version}.tar.gz

%if 0%{?rhel}
BuildRequires:  epel-release
%endif
BuildRequires:  nodejs
BuildRequires:  npm

%description
DCI UI static files

%prep -a
%setup -qc

%build
npm install
npm run build

%install
install -d -m0755 %{buildroot}/srv/www/dci-ui
cp -r build/* %{buildroot}/srv/www/dci-ui

%files
/srv/www/dci-ui/*
%config(noreplace) /srv/www/dci-ui/config.json

%changelog
* Thu Sep 20 2018 Dimitri Savineau <dsavinea@redhat.com> 0.1.1-1
- Remove simlink for config file

* Tue Aug 7 2018 Guillaume Vincent <gvincent@redhat.com> 0.1.0-1
- Migration from AngularJS to React

* Fri Jun 23 2017 Guillaume Vincent <gvincent@redhat.com> 0.0-2
- Use npm script instead of gulp to build the application

* Mon Jan 11 2016 Yanis Guenane <yguenane@redhat.com> 0.0-1
- Initial commit
