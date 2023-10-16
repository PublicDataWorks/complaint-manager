import React from "react";
import { colors } from "../publicInfoStyles";
export const mythsAndFactsData = [
  {
    category: "Overcrowding",
    statements: [
      {
        id: 1,
        myth: "Prison overcrowding is primarily caused by an increase in crime rates.",
        fact: (
          <span>
            While crime rates can contribute to prison populations, the{" "}
            <span style={{ color: colors.secondaryBrand }}>
              main driver of prison overcrowding is the excessive and
              disproportionate
            </span>{" "}
            use of incarceration as a response to crime. Factors such as{" "}
            <span style={{ color: colors.secondaryBrand }}>
              mandatory minimum sentences, harsher sentencing practices, and the
              limited use of alternative sentencing
            </span>{" "}
            options have led to an influx of individuals into correctional
            facilities, surpassing their capacity.
          </span>
        )
      },
      {
        id: 2,
        myth: "Building more prisons is the only solution to address prison overcrowding.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Simply building more prisons is not a comprehensive solution
            </span>{" "}
            to prison overcrowding. While increasing capacity may provide
            short-term relief, it fails to address the underlying issues.
            Long-term strategies should{" "}
            <span style={{ color: colors.secondaryBrand }}>
              focus on reducing unnecessary incarceration, promoting
              alternatives to imprisonment,
            </span>{" "}
            implementing evidence-based sentencing practices, and investing in
            rehabilitative programs to reduce recidivism.
          </span>
        )
      },
      {
        id: 3,
        myth: "Lengthening prison sentences is an effective way to manage prison overcrowding.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Lengthening prison sentences exacerbates prison overcrowding
            </span>{" "}
            rather than resolving it.{" "}
            <span style={{ color: colors.secondaryBrand }}>
              Longer sentences increase the average length of stay,
            </span>{" "}
            resulting in fewer available beds for incoming inmates. This
            approach also fails to consider the effectiveness of rehabilitation
            and reintegration efforts, which are crucial for reducing recidivism
            and promoting successful reentry into society.
          </span>
        )
      },
      {
        id: 4,
        myth: "Prison overcrowding doesn't impact the well-being and safety of incarcerated individuals.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Prison overcrowding significantly affects the well-being and
              safety of incarcerated individuals.
            </span>{" "}
            Overcrowded conditions can lead to increased violence, mental health
            issues, and the spread of diseases. Limited resources and inadequate
            staffing ratios make it{" "}
            <span style={{ color: colors.secondaryBrand }}>
              challenging to provide adequate healthcare, education, and
              rehabilitation programs,
            </span>{" "}
            hindering the potential for successful reintegration.
          </span>
        )
      },
      {
        id: 5,
        myth: "Prison overcrowding doesn't impact the well-being and safety of staff and correctional officers.",
        fact: (
          <span>
            Prison overcrowding significantly affects the well-being and safety
            of staff and correctional officers.{" "}
            <span style={{ color: colors.secondaryBrand }}>
              Correctional officers are understaffed and overworked. Currently,
              254 officers typically work 16-48 hr shifts.
            </span>
          </span>
        )
      }
    ]
  },
  {
    category: "Bail Reform",
    statements: [
      {
        id: 1,
        myth: "Bail reform results in increased crime rates.",
        fact: (
          <span>
            Research indicates that{" "}
            <span style={{ color: colors.secondaryBrand }}>
              bail reform does not contribute to higher crime rates
            </span>{" "}
            and can, in fact,{" "}
            <span style={{ color: colors.secondaryBrand }}>
              reduce recidivism by addressing underlying issues.
            </span>
          </span>
        )
      },
      {
        id: 2,
        myth: "Bail reform burdens taxpayers by increasing costs.",
        fact: (
          <span>
            Bail reform can{" "}
            <span style={{ color: colors.secondaryBrand }}>
              lead to cost savings by reducing unnecessary pretrial detention,
            </span>{" "}
            allowing resources to be allocated more effectively.
          </span>
        )
      },
      {
        id: 3,
        myth: "HB 1567, the bail reform bill that would allow non-violent offenders to be released on their own recognizance without posting monetary bail.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              People who are legally innocent and awaiting trial should not be
              deprived of their liberty
            </span>{" "}
            simply because they are unable to afford cash bail. Yet, our current
            criminal legal system does just that – it{" "}
            <span style={{ color: colors.secondaryBrand }}>
              lets the size of a person’s wallet determine whether they can
              return home or stay locked up in jail
            </span>{" "}
            even though they are merely accused, not convicted of a crime.
            However, the final version of the bill that passed has twenty (20)
            carved out exceptions and categorically excludes people charged with
            Class C drug possession. In effect,{" "}
            <span style={{ color: colors.secondaryBrand }}>
              this bill prohibits release on recognizance for MOST of the crimes
              people are frequently charged with
            </span>{" "}
            and detained for pretrial.
          </span>
        )
      },
      {
        id: 4,
        myth: "HB 1567 is a “get out of jail free card” and will release criminals into our streets.",
        fact: (
          <span>
            Given the twenty carved-out exemptions (see list of offenses),{" "}
            <span style={{ color: colors.secondaryBrand }}>
              the bill will likely result in nominal releases of those awaiting
              trial.
            </span>
            People released are still required to return for their court
            hearings and are legally innocent unless proven guilty for any
            alleged offenses.
          </span>
        )
      }
    ]
  },
  {
    category: "Probation",
    statements: [
      {
        id: 1,
        myth: "Long probation lengths are necessary to ensure public safety.",
        fact: (
          <span>
            While probation serves as a means of supervising individuals after
            their release from prison, excessively long probation periods can
            have detrimental effects.{" "}
            <span style={{ color: colors.secondaryBrand }}>
              Research suggests that longer probation terms do not necessarily
              lead to improved outcomes
            </span>{" "}
            or increased public safety.{" "}
            <span style={{ color: colors.secondaryBrand }}>
              Instead, they can place unnecessary burdens on individuals,
            </span>{" "}
            hinder successful reintegration, and perpetuate cycles of
            incarceration.
          </span>
        )
      },
      {
        id: 2,
        myth: "Extended probation terms deter individuals from reoffending.",
        fact: (
          <span>
            The{" "}
            <span style={{ color: colors.secondaryBrand }}>
              length of probation has limited impact
            </span>{" "}
            on deterrence. Studies indicate that{" "}
            <span style={{ color: colors.secondaryBrand }}>
              the effectiveness of probation lies in the quality of supervision
              and support provided
            </span>
            , rather than the duration. Focusing on evidence-based practices,
            such as tailored rehabilitation programs, access to education,
            employment opportunities, and mental health support, can have a more
            significant impact on reducing recidivism rates.
          </span>
        )
      },
      {
        id: 3,
        myth: "Longer probation periods provide individuals with more opportunities for rehabilitation.",
        fact: (
          <span>
            Extended probation periods do not inherently translate to increased
            access to rehabilitative services. In fact,{" "}
            <span style={{ color: colors.secondaryBrand }}>
              individuals on long probation terms may face greater challenges in
              accessing resources
            </span>
            due to ongoing supervision requirements, restricted mobility, and
            limited availability of programming within the community. Tailored,
            intensive rehabilitation efforts during a shorter probation period
            can be more effective in facilitating successful reintegration."
          </span>
        )
      },
      {
        id: 4,
        myth: "Lengthy probation terms provide sufficient time for individuals to rebuild their lives.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Extended probation periods can impede successful reintegration by
              placing prolonged restrictions
            </span>{" "}
            on individuals' lives. These restrictions may include limitations on
            travel, housing, employment, and personal relationships. Such
            constraints can hinder individuals from rebuilding their lives,
            securing stable employment, and establishing positive support
            networks, ultimately increasing the risk of reoffending.
          </span>
        )
      },
      {
        id: 5,
        myth: "Longer probation periods are cost-effective for the criminal justice system.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Prolonged probation terms can incur significant costs for the
              criminal justice system.
            </span>{" "}
            Increased supervision requirements, additional court hearings, and
            extended administrative procedures all contribute to higher
            expenses. Investing in evidence-based rehabilitation programs and
            support services during a shorter probation period can lead to
            better outcomes, reduce recidivism, and result in cost savings for
            the criminal justice system.
          </span>
        )
      }
    ]
  },
  {
    category: "Recidivism",
    statements: [
      {
        id: 1,
        myth: "Prison is solely meant for punishment, not rehabilitation.",
        fact: (
          <span>
            While punishment is one aspect of the correctional system,{" "}
            <span style={{ color: colors.secondaryBrand }}>
              the ultimate goal should be to promote rehabilitation and reduce
              recidivism
            </span>
            . Numerous studies have demonstrated that{" "}
            <span style={{ color: colors.secondaryBrand }}>
              providing educational programs, vocational training, mental health
              support, substance abuse treatment, and other rehabilitative
              initiatives
            </span>
            within prisons can significantly lower reoffending rates.
          </span>
        )
      },
      {
        id: 2,
        myth: "Rehabilitative programs are a waste of resources.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Investing in rehabilitative programs is a wise allocation of
              resources.
            </span>{" "}
            By addressing the root causes of criminal behavior, such as trauma,
            lack of education and stable housing, unemployment, substance abuse,
            and mental health issues, these programs can break the cycle of
            crime and{" "}
            <span style={{ color: colors.secondaryBrand }}>
              save society significant costs associated with repeated
              incarcerations.
            </span>
          </span>
        )
      },
      {
        id: 3,
        myth: "Community-based alternatives to incarceration are ineffective.",
        fact: (
          <span>
            Community-based alternatives, such as probation, parole, and
            diversion programs, have{" "}
            <span style={{ color: colors.secondaryBrand }}>
              shown promise in reducing recidivism rates.
            </span>
            These programs focus on providing support, supervision, and
            treatment services to individuals while allowing them to remain in
            their communities. By addressing the underlying causes of criminal
            behavior and providing necessary resources,{" "}
            <span style={{ color: colors.secondaryBrand }}>
              these alternatives can facilitate successful reintegration and
              promote public safety.
            </span>
          </span>
        )
      },
      {
        id: 4,
        myth: "Rehabilitative efforts have no impact on public safety.",
        fact: (
          <span>
            Research consistently demonstrates that{" "}
            <span style={{ color: colors.secondaryBrand }}>
              effective rehabilitation reduces recidivism rates, making
              communities safer.
            </span>{" "}
            By equipping individuals with the necessary tools to reintegrate
            successfully, such as education, job skills, and support networks,
            they are less likely to engage in criminal activities, thus{" "}
            <span style={{ color: colors.secondaryBrand }}>
              improving public safety and reducing the burden on the
              correctional system.
            </span>
          </span>
        )
      }
    ]
  },
  {
    category: "Rehabilitative Programs",
    statements: [
      {
        id: 1,
        myth: "Educational programs in correctional facilities are a waste of taxpayer money.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Educational programs in correctional facilities have been shown to
              be cost-effective
            </span>{" "}
            in the long run. Inmates who participate in educational programs are
            less likely to reoffend, reducing the burden on the criminal justice
            system. Additionally,{" "}
            <span style={{ color: colors.secondaryBrand }}>
              providing education to incarcerated individuals can lead to better
              employment prospects post-release
            </span>
            , resulting in increased tax contributions and reduced reliance on
            social services.
          </span>
        )
      },
      {
        id: 2,
        myth: "Educational programs in correctional facilities are not effective in reducing recidivism.",
        fact: (
          <span>
            <span style={{ color: colors.secondaryBrand }}>
              Extensive research has shown that educational programs in
              correctional facilities significantly reduce recidivism rates.
            </span>
            Inmates who participate in{" "}
            <span style={{ color: colors.secondaryBrand }}>
              educational programs are more likely to find employment,
            </span>{" "}
            have a stable living situation, and positively engage with their
            communities upon release.{" "}
            <span style={{ color: colors.secondaryBrand }}>
              Education provides individuals with a sense of purpose,
              self-worth, and alternatives to criminal behavior.
            </span>
          </span>
        )
      }
    ]
  }
];
